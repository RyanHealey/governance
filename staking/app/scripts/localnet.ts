import * as anchor from "@coral-xyz/anchor";
import BN from "bn.js";
import {Keypair, PublicKey} from "@solana/web3.js";
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
import {Idl, Program} from "@coral-xyz/anchor";
// @ts-ignore
import { IDL } from "../coral_multisig"

const portNumber = 8899;
async function main() {



    let stakeConnection: StakeConnection;
    let controller: CustomAbortController;

    const pythMintAuthority = new Keypair();

    const alice = loadKeypair("./app/keypairs/alice.json");
    const bob = loadKeypair("./app/keypairs/bob.json");
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

    for (let owner of [alice.publicKey, bob.publicKey]) {
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

    let multiSig = new Program((IDL as Idl), new PublicKey("86A3SjX2cdavMiAhipoZGbVmKq8Tbari4g3pc9iAqWL"), stakeConnection.provider);

    const ownerA = anchor.web3.Keypair.generate();
    const ownerB = anchor.web3.Keypair.generate();
    const ownerC = anchor.web3.Keypair.generate();
    const ownerD = anchor.web3.Keypair.generate();
    const ownerE = anchor.web3.Keypair.generate();
    const owners = [ownerA.publicKey, ownerB.publicKey, ownerC.publicKey, ownerD.publicKey, ownerE.publicKey];

    const threshold = new anchor.BN(3);
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


    //Bob
    const bobMultisigPair = anchor.web3.Keypair.generate();

    const [bobMultisigSigner, bobNonce] =
        anchor.web3.PublicKey.findProgramAddressSync(
            [bobMultisigPair.publicKey.toBuffer()],
            multiSig.programId
        );
    await multiSig.methods.createMultisig(owners, threshold, bobNonce).accounts(
        {
            multisig: bobMultisigPair.publicKey,
        })
        .preInstructions([await multiSig.account.multisig.createInstruction(
            bobMultisigPair,
            multisigSize
        )])
        .signers([bobMultisigPair])
        .rpc();

    console.log("Bob Multisig: ", bobMultisigPair.publicKey.toBase58(), ", Bob Signer: ", bobMultisigSigner.toBase58());

    const bobStakeConnection = await StakeConnection.createStakeConnection(
        stakeConnection.program.provider.connection,
        new anchor.Wallet(new Keypair({publicKey: bobMultisigSigner.toBytes(), secretKey: undefined})),
        stakeConnection.program.programId
    );

    // Alice tokens are fully vested
    let depositAndLockTx = await aliceStakeConnection.depositAndLockTokens(
        undefined,
        PythBalance.fromString("500")
    );
    // depositAndLockTx.transaction.instructions.forEach(ix => console.log(ix))

    // let stakeAccounts = await aliceStakeConnection.getStakeAccounts(alice.publicKey);
    // let stakeAccount = stakeAccounts.pop();
    // aliceStakeConnection.getTime().then(time => console.log(stakeAccount.getBalanceSummary(time)))

    const vestingSchedule = {
        periodicVestingAfterListing: {
            initialBalance: PythBalance.fromString("100").toBN(),
            startDate: await stakeConnection.getTime(),
            periodDuration: new BN(3600),
            numPeriods: new BN(1000),
        },
    };

    // Bob has a vesting schedule

    let vestingTx = await bobStakeConnection.setupVestingAccount(
        PythBalance.fromString("500"),
        bob.publicKey,
        vestingSchedule
    );

    // console.log(vestingTx)

    // await aliceStakeConnection.unlockTokens(stakeAccount, PythBalance.fromString("500"));
    await stakeConnection.program.methods
        .advanceClock(new BN(EPOCH_DURATION).mul(new BN(3)))
        .rpc();

    // stakeAccounts = await aliceStakeConnection.getStakeAccounts(alice.publicKey);
    // stakeAccount = stakeAccounts.pop();
    // aliceStakeConnection.getTime().then(time => console.log(stakeAccount.getBalanceSummary(time)))

    // let newVar = await aliceStakeConnection.withdrawTokens(stakeAccount, PythBalance.fromNumber(250));
    // console.log(newVar)

    while (true) {
    }
}

main();
