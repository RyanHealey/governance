import * as anchor from "@coral-xyz/anchor";
// @ts-ignore
import BN from "bn.js";
import {Keypair, PublicKey, Signer, Transaction, TransactionInstruction, VersionedTransaction} from "@solana/web3.js";
import {
    readAnchorConfig,
    standardSetup,
    ANCHOR_CONFIG_PATH,
    requestPythAirdrop,
    CustomAbortController,
    getDummyAgreementHash,
} from "../../tests/utils/before";
import {StakeConnection, PythBalance} from "..";
import {loadKeypair} from "../../tests/utils/keys";
import {EPOCH_DURATION, StakeAccount} from "../../lib/app";
import {AnchorProvider, Idl, Program} from "@coral-xyz/anchor";
// @ts-ignore
import {CoralMultisig, IDL} from "../coral_multisig"

const portNumber = 8899;

async function main() {


    let stakeConnection: StakeConnection;
    let controller: CustomAbortController;

    const pythMintAuthority = new Keypair();
    const pythMintAccount = loadKeypair("./app/keypairs/pyth_mint.json");

    console.log("Validator at port ", portNumber);
    const config = readAnchorConfig(ANCHOR_CONFIG_PATH);
    ({controller, stakeConnection} = await standardSetup(
        portNumber,
        config,
        pythMintAccount,
        pythMintAuthority,
        {
            bump: 0,
            governanceAuthority: null,
            pythGovernanceRealm: null,
            pythTokenMint: pythMintAccount.publicKey,
            unlockingDuration: 2,
            epochDuration: new BN(1),
            mockClockTime: new BN(10),
            freeze: false,
            pdaAuthority: new PublicKey(0),
            governanceProgram: new PublicKey(0),
            pythTokenListTime: null,
            agreementHash: getDummyAgreementHash(),
        }
    ));

    console.log("Finished set up")

    let multiSig = new Program((IDL as Idl), new PublicKey("86A3SjX2cdavMiAhipoZGbVmKq8Tbari4g3pc9iAqWL"), stakeConnection.provider);

    const ownerA = anchor.web3.Keypair.generate();
    const ownerB = anchor.web3.Keypair.generate();
    const ownerC = anchor.web3.Keypair.generate();
    const ownerD = anchor.web3.Keypair.generate();
    const ownerE = anchor.web3.Keypair.generate();
    const owners = [ownerA.publicKey, ownerB.publicKey, ownerC.publicKey, ownerD.publicKey, ownerE.publicKey];

    const threshold = new anchor.BN(owners.length - 2);
    const multisigSize = 200; // Big enough.

    // Create multisigs
    //Alice

    const aliceMultisigPair = anchor.web3.Keypair.generate();

    const [aliceMultisigSigner, aliceNonce] =
        anchor.web3.PublicKey.findProgramAddressSync(
            [aliceMultisigPair.publicKey.toBuffer()],
            multiSig.programId
        );
    await multiSig.methods.createMultisig(owners, threshold, aliceNonce).accounts(
        {
            multisig: aliceMultisigPair.publicKey,
        })
        .preInstructions([await multiSig.account.multisig.createInstruction(
            aliceMultisigPair,
            multisigSize
        )])
        .signers([aliceMultisigPair])
        .rpc();

    console.log("Alice Multisig: ", aliceMultisigPair.publicKey.toBase58(), ", Alice Signer: ", aliceMultisigSigner.toBase58());

    const aliceStakeConnection = await StakeConnection.createStakeConnection(
        stakeConnection.program.provider.connection,
        new anchor.Wallet(new Keypair({publicKey: aliceMultisigSigner.toBytes(), secretKey: undefined})),
        stakeConnection.program.programId
    );

    for (let owner of [aliceMultisigSigner]) {
        await stakeConnection.program.provider.connection.requestAirdrop(
            owner,
            1_000_000_000_000
        );
        await requestPythAirdrop(
            owner,
            pythMintAccount.publicKey,
            pythMintAuthority,
            PythBalance.fromString("1000"),
            stakeConnection.program.provider.connection
        );
    }

    // Alice tokens are fully vested
    let {transaction, signers} = await aliceStakeConnection.depositAndLockTokens(
        undefined,
        PythBalance.fromString("500")
    );

    const transactionPubKeys = await createTransaction(transaction, ownerA, multiSig, aliceMultisigPair.publicKey);
    await approveTransactions(multiSig, aliceMultisigPair, transactionPubKeys.map(tx => tx.transactionKey), ownerB);
    await approveTransactions(multiSig, aliceMultisigPair, transactionPubKeys.map(tx => tx.transactionKey), ownerC);
    await executeTransactionsTransactionally(transactionPubKeys, multiSig, aliceMultisigSigner, aliceMultisigPair.publicKey, signers, stakeConnection.provider)

    console.log("Tokens locked!")

    let stakeAccounts = await aliceStakeConnection.getStakeAccounts(aliceMultisigSigner);
    let stakeAccount = stakeAccounts.pop();
    aliceStakeConnection.getTime().then(time => console.log(stakeAccount.getBalanceSummary(time)))
    let unlockTransactions = await aliceStakeConnection.unlockTokens(stakeAccount, PythBalance.fromString("500"));

    await stakeConnection.program.methods
        .advanceClock(new BN(EPOCH_DURATION).mul(new BN(3)))
        .rpc();

    for (const unlockTransaction of unlockTransactions) {
        let transactionPubKeys = await createTransaction(unlockTransaction, ownerA, multiSig, aliceMultisigPair.publicKey);
        await approveTransactions(multiSig, aliceMultisigPair, transactionPubKeys.map(tx => tx.transactionKey), ownerB)
        await approveTransactions(multiSig, aliceMultisigPair, transactionPubKeys.map(tx => tx.transactionKey), ownerC)
        await executeTransactionsTransactionally(transactionPubKeys, multiSig, aliceMultisigSigner, aliceMultisigPair.publicKey, [], stakeConnection.provider)
    }

    console.log("Tokens unlocked")

    await stakeConnection.program.methods
        .advanceClock(new BN(EPOCH_DURATION).mul(new BN(3)))
        .rpc();

    stakeAccounts = await aliceStakeConnection.getStakeAccounts(aliceMultisigSigner);
    stakeAccount = stakeAccounts.pop();
    aliceStakeConnection.getTime().then(time => console.log(stakeAccount.getBalanceSummary(time)))

    let withdrawTransaction = await aliceStakeConnection.withdrawTokens(stakeAccount, PythBalance.fromString("1"));
    let transactionPubKeys2 = await createTransaction(withdrawTransaction, ownerA, multiSig, aliceMultisigPair.publicKey);

    await approveTransactions(multiSig, aliceMultisigPair, transactionPubKeys2.map(tx => tx.transactionKey), ownerB)
    await approveTransactions(multiSig, aliceMultisigPair, transactionPubKeys2.map(tx => tx.transactionKey), ownerC)
    await executeTransactionsTransactionally(transactionPubKeys2, multiSig, aliceMultisigSigner, aliceMultisigPair.publicKey, [], stakeConnection.provider)

    console.log("Tokens withdrawn")

    while (true) {
    }
}

async function createTransaction(transaction: Transaction, proposer: Keypair, program: Program, multisig: PublicKey) {

    console.log("Creating transaction accounts")

    const transactionPubKeys = [];


    for (const ix of transaction.instructions) {
        let transactionKeyPair = anchor.web3.Keypair.generate();
        await program.methods.createTransaction(ix.programId, ix.keys, ix.data)
            .accounts({
                multisig: multisig,
                transaction: transactionKeyPair.publicKey,
                proposer: proposer.publicKey
            })
            .preInstructions([await program.account.transaction.createInstruction(
                transactionKeyPair,
                1000
            )])
            .signers([transactionKeyPair, proposer])
            .rpc()

        transactionPubKeys.push({
            transactionKey: transactionKeyPair.publicKey,
            instructionKeys: ix.keys,
            programKey: ix.programId
        });
    }

    return transactionPubKeys
}

async function approveTransactions(multiSig: Program, aliceMultisigPair: Keypair, transactionPubKeys, ownerB: Keypair) {
    console.log("Approving transaction")

    for (const tx of transactionPubKeys) {
        await multiSig.methods.approve()
            .accounts(
                {
                    multisig: aliceMultisigPair.publicKey,
                    transaction: tx,
                    owner: ownerB.publicKey
                }
            )
            .signers([ownerB])
            .rpc()
    }
}

async function executeTransactionsTransactionally(transactionPubKeys: Array<any>, program: Program, signer: PublicKey, multisig: PublicKey, signers: Array<Signer>, provider: AnchorProvider) {
    console.log("Executing transaction")

    const txIx = new Transaction()
    for (const tx of transactionPubKeys) {
        txIx.add(
            await program.methods.executeTransaction()
                .accounts(
                    {
                        multisig: multisig,
                        multisigSigner: signer,
                        transaction: tx.transactionKey
                    }
                )
                .remainingAccounts(
                    tx.instructionKeys
                        // Change the signer status on the vendor signer since it's signed by the program, not the client.
                        .map((meta) =>
                            meta.pubkey.equals(signer)
                                ? {...meta, isSigner: false}
                                : meta
                        )
                        .concat({
                            pubkey: tx.programKey,
                            isWritable: false,
                            isSigner: false,
                        })
                )
                .transaction()
        )
    }

    await provider.sendAndConfirm(txIx, signers)

}

main();
