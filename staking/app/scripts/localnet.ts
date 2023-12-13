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

    const aliceStakeConnection = await StakeConnection.createStakeConnection(
        stakeConnection.program.provider.connection,
        new anchor.Wallet(alice),
        stakeConnection.program.programId
    );

    const bobStakeConnection = await StakeConnection.createStakeConnection(
        stakeConnection.program.provider.connection,
        new anchor.Wallet(bob),
        stakeConnection.program.programId
    );

    // Alice tokens are fully vested
    let depositAndLockTx = await aliceStakeConnection.depositAndLockTokens(
        undefined,
        PythBalance.fromString("500")
    );
    console.log(depositAndLockTx)

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

    console.log(vestingTx)

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
