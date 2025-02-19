export type Staking = {
  "version": "1.0.0",
  "name": "staking",
  "instructions": [
    {
      "name": "initConfig",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "configAccount",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "config"
              }
            ]
          }
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "globalConfig",
          "type": {
            "defined": "GlobalConfig"
          }
        }
      ]
    },
    {
      "name": "updateGovernanceAuthority",
      "accounts": [
        {
          "name": "governanceSigner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "config",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "config"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "newAuthority",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "updatePdaAuthority",
      "accounts": [
        {
          "name": "governanceSigner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "config",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "config"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "newAuthority",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "updateTokenListTime",
      "accounts": [
        {
          "name": "governanceSigner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "config",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "config"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "tokenListTime",
          "type": {
            "option": "i64"
          }
        }
      ]
    },
    {
      "name": "updateAgreementHash",
      "accounts": [
        {
          "name": "governanceSigner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "config",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "config"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "agreementHash",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        }
      ]
    },
    {
      "name": "createStakeAccount",
      "docs": [
        "Trustless instruction that creates a stake account for a user",
        "The main account i.e. the position accounts needs to be initialized outside of the program",
        "otherwise we run into stack limits"
      ],
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "stakeAccountPositions",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakeAccountMetadata",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "stake_metadata"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "stake_account_positions"
              }
            ]
          }
        },
        {
          "name": "stakeAccountCustody",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "custody"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "stake_account_positions"
              }
            ]
          }
        },
        {
          "name": "custodyAuthority",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK : This AccountInfo is safe because it's a checked PDA"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "authority"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "stake_account_positions"
              }
            ]
          }
        },
        {
          "name": "voterRecord",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "voter_weight"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "stake_account_positions"
              }
            ]
          }
        },
        {
          "name": "config",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "config"
              }
            ]
          }
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "owner",
          "type": "publicKey"
        },
        {
          "name": "lock",
          "type": {
            "defined": "VestingSchedule"
          }
        }
      ]
    },
    {
      "name": "createPosition",
      "docs": [
        "Creates a position",
        "Looks for the first available place in the array, fails if array is full",
        "Computes risk and fails if new positions exceed risk limit"
      ],
      "accounts": [
        {
          "name": "payer",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "stakeAccountPositions",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakeAccountMetadata",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "stake_metadata"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "stake_account_positions"
              }
            ]
          }
        },
        {
          "name": "stakeAccountCustody",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "custody"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "stake_account_positions"
              }
            ]
          }
        },
        {
          "name": "config",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "config"
              }
            ]
          }
        },
        {
          "name": "targetAccount",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "targetWithParameters",
          "type": {
            "defined": "TargetWithParameters"
          }
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "closePosition",
      "accounts": [
        {
          "name": "payer",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "stakeAccountPositions",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakeAccountMetadata",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "stake_metadata"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "stake_account_positions"
              }
            ]
          }
        },
        {
          "name": "stakeAccountCustody",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "custody"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "stake_account_positions"
              }
            ]
          }
        },
        {
          "name": "config",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "config"
              }
            ]
          }
        },
        {
          "name": "targetAccount",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "index",
          "type": "u8"
        },
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "targetWithParameters",
          "type": {
            "defined": "TargetWithParameters"
          }
        }
      ]
    },
    {
      "name": "withdrawStake",
      "accounts": [
        {
          "name": "payer",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "destination",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakeAccountPositions",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "stakeAccountMetadata",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "stake_metadata"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "stake_account_positions"
              }
            ]
          }
        },
        {
          "name": "stakeAccountCustody",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "custody"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "stake_account_positions"
              }
            ]
          }
        },
        {
          "name": "custodyAuthority",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK : This AccountInfo is safe because it's a checked PDA"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "authority"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "stake_account_positions"
              }
            ]
          }
        },
        {
          "name": "config",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "config"
              }
            ]
          }
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "updateVoterWeight",
      "accounts": [
        {
          "name": "payer",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "stakeAccountPositions",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "stakeAccountMetadata",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "stake_metadata"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "stake_account_positions"
              }
            ]
          }
        },
        {
          "name": "stakeAccountCustody",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "custody"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "stake_account_positions"
              }
            ]
          }
        },
        {
          "name": "voterRecord",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "voter_weight"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "stake_account_positions"
              }
            ]
          }
        },
        {
          "name": "config",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "config"
              }
            ]
          }
        },
        {
          "name": "governanceTarget",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "target"
              },
              {
                "kind": "const",
                "type": "string",
                "value": "voting"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "action",
          "type": {
            "defined": "VoterWeightAction"
          }
        }
      ]
    },
    {
      "name": "updateMaxVoterWeight",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "maxVoterRecord",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "max_voter"
              }
            ]
          }
        },
        {
          "name": "config",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "config"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "createTarget",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "governanceSigner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "config",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "config"
              }
            ]
          }
        },
        {
          "name": "targetAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "target",
          "type": {
            "defined": "Target"
          }
        }
      ]
    },
    {
      "name": "advanceClock",
      "accounts": [
        {
          "name": "config",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "config"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "seconds",
          "type": "i64"
        }
      ]
    },
    {
      "name": "requestSplit",
      "docs": [
        "* Any user of the staking program can request to split their account and\n     * give a part of it to another user.\n     * This is mostly useful to transfer unvested tokens. Each user can only have one active\n     * request at a time.\n     * In the first step, the user requests a split by specifying the `amount` of tokens\n     * they want to give to the other user and the `recipient`'s pubkey."
      ],
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "stakeAccountPositions",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "stakeAccountMetadata",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "stake_metadata"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "stake_account_positions"
              }
            ]
          }
        },
        {
          "name": "stakeAccountSplitRequest",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "split_request"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "stake_account_positions"
              }
            ]
          }
        },
        {
          "name": "config",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "config"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "recipient",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "acceptSplit",
      "docs": [
        "* A split request can only be accepted by the `pda_authority`` from\n     * the config account. If accepted, `amount` tokens are transferred to a new stake account\n     * owned by the `recipient` and the split request is reset (by setting `amount` to 0).\n     * The recipient of a transfer can't vote during the epoch of the transfer.\n     *\n     * The `pda_authority` must explicitly approve both the amount of tokens and recipient, and\n     * these parameters must match the request (in the `split_request` account)."
      ],
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "sourceStakeAccountPositions",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "sourceStakeAccountMetadata",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "stake_metadata"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "source_stake_account_positions"
              }
            ]
          }
        },
        {
          "name": "sourceStakeAccountSplitRequest",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "split_request"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "source_stake_account_positions"
              }
            ]
          }
        },
        {
          "name": "sourceStakeAccountCustody",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "custody"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "source_stake_account_positions"
              }
            ]
          }
        },
        {
          "name": "sourceCustodyAuthority",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK : This AccountInfo is safe because it's a checked PDA"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "authority"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "source_stake_account_positions"
              }
            ]
          }
        },
        {
          "name": "newStakeAccountPositions",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "newStakeAccountMetadata",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "stake_metadata"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "new_stake_account_positions"
              }
            ]
          }
        },
        {
          "name": "newStakeAccountCustody",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "custody"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "new_stake_account_positions"
              }
            ]
          }
        },
        {
          "name": "newCustodyAuthority",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK : This AccountInfo is safe because it's a checked PDA"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "authority"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "new_stake_account_positions"
              }
            ]
          }
        },
        {
          "name": "newVoterRecord",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "voter_weight"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "new_stake_account_positions"
              }
            ]
          }
        },
        {
          "name": "config",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "config"
              }
            ]
          }
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "recipient",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "joinDaoLlc",
      "docs": [
        "* Accept to join the DAO LLC\n     * This must happen before create_position or update_voter_weight\n     * The user signs a hash of the agreement and the program checks that the hash matches the agreement"
      ],
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "stakeAccountPositions",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "stakeAccountMetadata",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "stake_metadata"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "stake_account_positions"
              }
            ]
          }
        },
        {
          "name": "config",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "config"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "agreementHash",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "globalConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "governanceAuthority",
            "type": "publicKey"
          },
          {
            "name": "pythTokenMint",
            "type": "publicKey"
          },
          {
            "name": "pythGovernanceRealm",
            "type": "publicKey"
          },
          {
            "name": "unlockingDuration",
            "type": "u8"
          },
          {
            "name": "epochDuration",
            "type": "u64"
          },
          {
            "name": "freeze",
            "type": "bool"
          },
          {
            "name": "pdaAuthority",
            "type": "publicKey"
          },
          {
            "name": "governanceProgram",
            "type": "publicKey"
          },
          {
            "name": "pythTokenListTime",
            "docs": [
              "Once the pyth token is listed, governance can update the config to set this value.",
              "Once this value is set, vesting schedules that depend on the token list date can start",
              "vesting."
            ],
            "type": {
              "option": "i64"
            }
          },
          {
            "name": "agreementHash",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "mockClockTime",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "maxVoterWeightRecord",
      "docs": [
        "Copied this struct from https://github.com/solana-labs/solana-program-library/blob/master/governance/addin-api/src/max_voter_weight.rs"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "realm",
            "docs": [
              "The Realm the MaxVoterWeightRecord belongs to"
            ],
            "type": "publicKey"
          },
          {
            "name": "governingTokenMint",
            "docs": [
              "Governing Token Mint the MaxVoterWeightRecord is associated with",
              "Note: The addin can take deposits of any tokens and is not restricted to the community or",
              "council tokens only"
            ],
            "type": "publicKey"
          },
          {
            "name": "maxVoterWeight",
            "docs": [
              "Max voter weight",
              "The max voter weight provided by the addin for the given realm and governing_token_mint"
            ],
            "type": "u64"
          },
          {
            "name": "maxVoterWeightExpiry",
            "docs": [
              "The slot when the max voting weight expires",
              "It should be set to None if the weight never expires",
              "If the max vote weight decays with time, for example for time locked based weights, then",
              "the expiry must be set As a pattern Revise instruction to update the max weight should",
              "be invoked before governance instruction within the same transaction and the expiry set",
              "to the current slot to provide up to date weight"
            ],
            "type": {
              "option": "u64"
            }
          },
          {
            "name": "reserved",
            "docs": [
              "Reserved space for future versions"
            ],
            "type": {
              "array": [
                "u8",
                8
              ]
            }
          }
        ]
      }
    },
    {
      "name": "positionData",
      "docs": [
        "An array that contains all of a user's positions i.e. where are the staking and who are they",
        "staking to.",
        "The invariant we preserve is : For i < next_index, positions[i] == Some",
        "For i >= next_index, positions[i] == None"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "positions",
            "type": {
              "array": [
                {
                  "array": [
                    "u8",
                    200
                  ]
                },
                20
              ]
            }
          }
        ]
      }
    },
    {
      "name": "splitRequest",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "recipient",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "stakeAccountMetadataV2",
      "docs": [
        "This is the metadata account for each staker",
        "It is derived from the positions account with seeds \"stake_metadata\" and the positions account",
        "pubkey It stores some PDA bumps, the owner of the account and the vesting schedule"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "metadataBump",
            "type": "u8"
          },
          {
            "name": "custodyBump",
            "type": "u8"
          },
          {
            "name": "authorityBump",
            "type": "u8"
          },
          {
            "name": "voterBump",
            "type": "u8"
          },
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "lock",
            "type": {
              "defined": "VestingSchedule"
            }
          },
          {
            "name": "nextIndex",
            "type": "u8"
          },
          {
            "name": "transferEpoch",
            "type": {
              "option": "u64"
            }
          },
          {
            "name": "signedAgreementHash",
            "type": {
              "option": {
                "array": [
                  "u8",
                  32
                ]
              }
            }
          }
        ]
      }
    },
    {
      "name": "targetMetadata",
      "docs": [
        "This represents a target that users can stake to",
        "Currently we store the last time the target account was updated, the current locked balance",
        "and the amount by which the locked balance will change in the next epoch"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "lastUpdateAt",
            "type": "u64"
          },
          {
            "name": "prevEpochLocked",
            "type": "u64"
          },
          {
            "name": "locked",
            "type": "u64"
          },
          {
            "name": "deltaLocked",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "voterWeightRecord",
      "docs": [
        "Copied this struct from https://github.com/solana-labs/solana-program-library/blob/master/governance/addin-api/src/voter_weight.rs",
        "Anchor has a macro (vote_weight_record) that is supposed to generate this struct, but it doesn't",
        "work because the error's macros are not updated for anchor 0.22.0.",
        "Even if it did work, the type wouldn't show up in the IDL. SPL doesn't produce an API, which",
        "means that means we'd need the equivalent of this code on the client side.",
        "If Anchor fixes the macro, we might consider changing it"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "realm",
            "docs": [
              "VoterWeightRecord discriminator sha256(\"account:VoterWeightRecord\")[..8]",
              "Note: The discriminator size must match the addin implementing program discriminator size",
              "to ensure it's stored in the private space of the account data and it's unique",
              "pub account_discriminator: [u8; 8],",
              "The Realm the VoterWeightRecord belongs to"
            ],
            "type": "publicKey"
          },
          {
            "name": "governingTokenMint",
            "docs": [
              "Governing Token Mint the VoterWeightRecord is associated with",
              "Note: The addin can take deposits of any tokens and is not restricted to the community or",
              "council tokens only"
            ],
            "type": "publicKey"
          },
          {
            "name": "governingTokenOwner",
            "docs": [
              "The owner of the governing token and voter",
              "This is the actual owner (voter) and corresponds to TokenOwnerRecord.governing_token_owner"
            ],
            "type": "publicKey"
          },
          {
            "name": "voterWeight",
            "docs": [
              "Voter's weight",
              "The weight of the voter provided by the addin for the given realm, governing_token_mint and",
              "governing_token_owner (voter)"
            ],
            "type": "u64"
          },
          {
            "name": "voterWeightExpiry",
            "docs": [
              "The slot when the voting weight expires",
              "It should be set to None if the weight never expires",
              "If the voter weight decays with time, for example for time locked based weights, then the",
              "expiry must be set As a common pattern Revise instruction to update the weight should",
              "be invoked before governance instruction within the same transaction and the expiry set",
              "to the current slot to provide up to date weight"
            ],
            "type": {
              "option": "u64"
            }
          },
          {
            "name": "weightAction",
            "docs": [
              "The governance action the voter's weight pertains to",
              "It allows to provided voter's weight specific to the particular action the weight is",
              "evaluated for When the action is provided then the governance program asserts the",
              "executing action is the same as specified by the addin"
            ],
            "type": {
              "option": {
                "defined": "VoterWeightAction"
              }
            }
          },
          {
            "name": "weightActionTarget",
            "docs": [
              "The target the voter's weight  action pertains to",
              "It allows to provided voter's weight specific to the target the weight is evaluated for",
              "For example when addin supplies weight to vote on a particular proposal then it must",
              "specify the proposal as the action target When the target is provided then the",
              "governance program asserts the target is the same as specified by the addin"
            ],
            "type": {
              "option": "publicKey"
            }
          },
          {
            "name": "reserved",
            "docs": [
              "Reserved space for future versions"
            ],
            "type": {
              "array": [
                "u8",
                8
              ]
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "Position",
      "docs": [
        "This represents a staking position, i.e. an amount that someone has staked to a particular",
        "target. This is one of the core pieces of our staking design, and stores all",
        "of the state related to a position The voting position is a position where the",
        "target_with_parameters is VOTING"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "activationEpoch",
            "type": "u64"
          },
          {
            "name": "unlockingStart",
            "type": {
              "option": "u64"
            }
          },
          {
            "name": "targetWithParameters",
            "type": {
              "defined": "TargetWithParameters"
            }
          }
        ]
      }
    },
    {
      "name": "Target",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Voting"
          },
          {
            "name": "Staking",
            "fields": [
              {
                "name": "product",
                "type": "publicKey"
              }
            ]
          }
        ]
      }
    },
    {
      "name": "TargetWithParameters",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Voting"
          },
          {
            "name": "Staking",
            "fields": [
              {
                "name": "product",
                "type": "publicKey"
              },
              {
                "name": "publisher",
                "type": {
                  "defined": "Publisher"
                }
              }
            ]
          }
        ]
      }
    },
    {
      "name": "Publisher",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "DEFAULT"
          },
          {
            "name": "SOME",
            "fields": [
              {
                "name": "address",
                "type": "publicKey"
              }
            ]
          }
        ]
      }
    },
    {
      "name": "PositionState",
      "docs": [
        "The core states that a position can be in"
      ],
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "UNLOCKED"
          },
          {
            "name": "LOCKING"
          },
          {
            "name": "LOCKED"
          },
          {
            "name": "PREUNLOCKING"
          },
          {
            "name": "UNLOCKING"
          }
        ]
      }
    },
    {
      "name": "VestingSchedule",
      "docs": [
        "Represents how a given initial balance vests over time",
        "It is unit-less, but units must be consistent"
      ],
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "FullyVested"
          },
          {
            "name": "PeriodicVesting",
            "fields": [
              {
                "name": "initialBalance",
                "type": "u64"
              },
              {
                "name": "startDate",
                "type": "i64"
              },
              {
                "name": "periodDuration",
                "type": "u64"
              },
              {
                "name": "numPeriods",
                "type": "u64"
              }
            ]
          },
          {
            "name": "PeriodicVestingAfterListing",
            "fields": [
              {
                "name": "initialBalance",
                "type": "u64"
              },
              {
                "name": "periodDuration",
                "type": "u64"
              },
              {
                "name": "numPeriods",
                "type": "u64"
              }
            ]
          }
        ]
      }
    },
    {
      "name": "VoterWeightAction",
      "docs": [
        "The governance action VoterWeight is evaluated for"
      ],
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "CastVote"
          },
          {
            "name": "CommentProposal"
          },
          {
            "name": "CreateGovernance"
          },
          {
            "name": "CreateProposal"
          },
          {
            "name": "SignOffProposal"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "TooMuchExposureToProduct",
      "msg": "Too much exposure to product"
    },
    {
      "code": 6001,
      "name": "TooMuchExposureToGovernance",
      "msg": "Too much exposure to governance"
    },
    {
      "code": 6002,
      "name": "TokensNotYetVested",
      "msg": "Tokens not yet vested"
    },
    {
      "code": 6003,
      "name": "RiskLimitExceeded",
      "msg": "Risk limit exceeded"
    },
    {
      "code": 6004,
      "name": "TooManyPositions",
      "msg": "Number of position limit reached"
    },
    {
      "code": 6005,
      "name": "PositionNotInUse",
      "msg": "Position not in use"
    },
    {
      "code": 6006,
      "name": "CreatePositionWithZero",
      "msg": "New position needs to have positive balance"
    },
    {
      "code": 6007,
      "name": "ClosePositionWithZero",
      "msg": "Closing a position of 0 is not allowed"
    },
    {
      "code": 6008,
      "name": "InvalidPosition",
      "msg": "Invalid product/publisher pair"
    },
    {
      "code": 6009,
      "name": "AmountBiggerThanPosition",
      "msg": "Amount to unlock bigger than position"
    },
    {
      "code": 6010,
      "name": "AlreadyUnlocking",
      "msg": "Position already unlocking"
    },
    {
      "code": 6011,
      "name": "ZeroEpochDuration",
      "msg": "Epoch duration is 0"
    },
    {
      "code": 6012,
      "name": "WithdrawToUnauthorizedAccount",
      "msg": "Owner needs to own destination account"
    },
    {
      "code": 6013,
      "name": "InsufficientWithdrawableBalance",
      "msg": "Insufficient balance to cover the withdrawal"
    },
    {
      "code": 6014,
      "name": "WrongTarget",
      "msg": "Target in position doesn't match target in instruction data"
    },
    {
      "code": 6015,
      "name": "GenericOverflow",
      "msg": "An arithmetic operation unexpectedly overflowed"
    },
    {
      "code": 6016,
      "name": "NegativeBalance",
      "msg": "Locked balance must be positive"
    },
    {
      "code": 6017,
      "name": "Frozen",
      "msg": "Protocol is frozen"
    },
    {
      "code": 6018,
      "name": "DebuggingOnly",
      "msg": "Not allowed when not debugging"
    },
    {
      "code": 6019,
      "name": "ProposalTooLong",
      "msg": "Proposal too long"
    },
    {
      "code": 6020,
      "name": "InvalidVotingEpoch",
      "msg": "Voting epoch is either too old or hasn't started"
    },
    {
      "code": 6021,
      "name": "ProposalNotActive",
      "msg": "Voting hasn't started"
    },
    {
      "code": 6022,
      "name": "NoRemainingAccount",
      "msg": "Extra governance account required"
    },
    {
      "code": 6023,
      "name": "Unauthorized",
      "msg": "Unauthorized caller"
    },
    {
      "code": 6024,
      "name": "AccountUpgradeFailed",
      "msg": "Precondition to upgrade account violated"
    },
    {
      "code": 6025,
      "name": "NotImplemented",
      "msg": "Not implemented"
    },
    {
      "code": 6026,
      "name": "PositionSerDe",
      "msg": "Error deserializing position"
    },
    {
      "code": 6027,
      "name": "PositionOutOfBounds",
      "msg": "Position out of bounds"
    },
    {
      "code": 6028,
      "name": "VoteDuringTransferEpoch",
      "msg": "Can't vote during an account's transfer epoch"
    },
    {
      "code": 6029,
      "name": "NotLlcMember",
      "msg": "You need to be an LLC member to perform this action"
    },
    {
      "code": 6030,
      "name": "InvalidLlcAgreement",
      "msg": "Invalid LLC agreement"
    },
    {
      "code": 6031,
      "name": "SplitZeroTokens",
      "msg": "Can't split 0 tokens from an account"
    },
    {
      "code": 6032,
      "name": "SplitTooManyTokens",
      "msg": "Can't split more tokens than are in the account"
    },
    {
      "code": 6033,
      "name": "SplitWithStake",
      "msg": "Can't split a token account with staking positions. Unstake your tokens first."
    },
    {
      "code": 6034,
      "name": "InvalidApproval",
      "msg": "The approval arguments do not match the split request."
    },
    {
      "code": 6035,
      "name": "Other",
      "msg": "Other"
    }
  ]
};

export const IDL: Staking = {
  "version": "1.0.0",
  "name": "staking",
  "instructions": [
    {
      "name": "initConfig",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "configAccount",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "config"
              }
            ]
          }
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "globalConfig",
          "type": {
            "defined": "GlobalConfig"
          }
        }
      ]
    },
    {
      "name": "updateGovernanceAuthority",
      "accounts": [
        {
          "name": "governanceSigner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "config",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "config"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "newAuthority",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "updatePdaAuthority",
      "accounts": [
        {
          "name": "governanceSigner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "config",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "config"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "newAuthority",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "updateTokenListTime",
      "accounts": [
        {
          "name": "governanceSigner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "config",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "config"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "tokenListTime",
          "type": {
            "option": "i64"
          }
        }
      ]
    },
    {
      "name": "updateAgreementHash",
      "accounts": [
        {
          "name": "governanceSigner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "config",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "config"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "agreementHash",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        }
      ]
    },
    {
      "name": "createStakeAccount",
      "docs": [
        "Trustless instruction that creates a stake account for a user",
        "The main account i.e. the position accounts needs to be initialized outside of the program",
        "otherwise we run into stack limits"
      ],
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "stakeAccountPositions",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakeAccountMetadata",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "stake_metadata"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "stake_account_positions"
              }
            ]
          }
        },
        {
          "name": "stakeAccountCustody",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "custody"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "stake_account_positions"
              }
            ]
          }
        },
        {
          "name": "custodyAuthority",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK : This AccountInfo is safe because it's a checked PDA"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "authority"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "stake_account_positions"
              }
            ]
          }
        },
        {
          "name": "voterRecord",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "voter_weight"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "stake_account_positions"
              }
            ]
          }
        },
        {
          "name": "config",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "config"
              }
            ]
          }
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "owner",
          "type": "publicKey"
        },
        {
          "name": "lock",
          "type": {
            "defined": "VestingSchedule"
          }
        }
      ]
    },
    {
      "name": "createPosition",
      "docs": [
        "Creates a position",
        "Looks for the first available place in the array, fails if array is full",
        "Computes risk and fails if new positions exceed risk limit"
      ],
      "accounts": [
        {
          "name": "payer",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "stakeAccountPositions",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakeAccountMetadata",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "stake_metadata"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "stake_account_positions"
              }
            ]
          }
        },
        {
          "name": "stakeAccountCustody",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "custody"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "stake_account_positions"
              }
            ]
          }
        },
        {
          "name": "config",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "config"
              }
            ]
          }
        },
        {
          "name": "targetAccount",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "targetWithParameters",
          "type": {
            "defined": "TargetWithParameters"
          }
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "closePosition",
      "accounts": [
        {
          "name": "payer",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "stakeAccountPositions",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakeAccountMetadata",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "stake_metadata"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "stake_account_positions"
              }
            ]
          }
        },
        {
          "name": "stakeAccountCustody",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "custody"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "stake_account_positions"
              }
            ]
          }
        },
        {
          "name": "config",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "config"
              }
            ]
          }
        },
        {
          "name": "targetAccount",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "index",
          "type": "u8"
        },
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "targetWithParameters",
          "type": {
            "defined": "TargetWithParameters"
          }
        }
      ]
    },
    {
      "name": "withdrawStake",
      "accounts": [
        {
          "name": "payer",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "destination",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakeAccountPositions",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "stakeAccountMetadata",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "stake_metadata"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "stake_account_positions"
              }
            ]
          }
        },
        {
          "name": "stakeAccountCustody",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "custody"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "stake_account_positions"
              }
            ]
          }
        },
        {
          "name": "custodyAuthority",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK : This AccountInfo is safe because it's a checked PDA"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "authority"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "stake_account_positions"
              }
            ]
          }
        },
        {
          "name": "config",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "config"
              }
            ]
          }
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "updateVoterWeight",
      "accounts": [
        {
          "name": "payer",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "stakeAccountPositions",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "stakeAccountMetadata",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "stake_metadata"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "stake_account_positions"
              }
            ]
          }
        },
        {
          "name": "stakeAccountCustody",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "custody"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "stake_account_positions"
              }
            ]
          }
        },
        {
          "name": "voterRecord",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "voter_weight"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "stake_account_positions"
              }
            ]
          }
        },
        {
          "name": "config",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "config"
              }
            ]
          }
        },
        {
          "name": "governanceTarget",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "target"
              },
              {
                "kind": "const",
                "type": "string",
                "value": "voting"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "action",
          "type": {
            "defined": "VoterWeightAction"
          }
        }
      ]
    },
    {
      "name": "updateMaxVoterWeight",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "maxVoterRecord",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "max_voter"
              }
            ]
          }
        },
        {
          "name": "config",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "config"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "createTarget",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "governanceSigner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "config",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "config"
              }
            ]
          }
        },
        {
          "name": "targetAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "target",
          "type": {
            "defined": "Target"
          }
        }
      ]
    },
    {
      "name": "advanceClock",
      "accounts": [
        {
          "name": "config",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "config"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "seconds",
          "type": "i64"
        }
      ]
    },
    {
      "name": "requestSplit",
      "docs": [
        "* Any user of the staking program can request to split their account and\n     * give a part of it to another user.\n     * This is mostly useful to transfer unvested tokens. Each user can only have one active\n     * request at a time.\n     * In the first step, the user requests a split by specifying the `amount` of tokens\n     * they want to give to the other user and the `recipient`'s pubkey."
      ],
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "stakeAccountPositions",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "stakeAccountMetadata",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "stake_metadata"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "stake_account_positions"
              }
            ]
          }
        },
        {
          "name": "stakeAccountSplitRequest",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "split_request"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "stake_account_positions"
              }
            ]
          }
        },
        {
          "name": "config",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "config"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "recipient",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "acceptSplit",
      "docs": [
        "* A split request can only be accepted by the `pda_authority`` from\n     * the config account. If accepted, `amount` tokens are transferred to a new stake account\n     * owned by the `recipient` and the split request is reset (by setting `amount` to 0).\n     * The recipient of a transfer can't vote during the epoch of the transfer.\n     *\n     * The `pda_authority` must explicitly approve both the amount of tokens and recipient, and\n     * these parameters must match the request (in the `split_request` account)."
      ],
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "sourceStakeAccountPositions",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "sourceStakeAccountMetadata",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "stake_metadata"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "source_stake_account_positions"
              }
            ]
          }
        },
        {
          "name": "sourceStakeAccountSplitRequest",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "split_request"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "source_stake_account_positions"
              }
            ]
          }
        },
        {
          "name": "sourceStakeAccountCustody",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "custody"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "source_stake_account_positions"
              }
            ]
          }
        },
        {
          "name": "sourceCustodyAuthority",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK : This AccountInfo is safe because it's a checked PDA"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "authority"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "source_stake_account_positions"
              }
            ]
          }
        },
        {
          "name": "newStakeAccountPositions",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "newStakeAccountMetadata",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "stake_metadata"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "new_stake_account_positions"
              }
            ]
          }
        },
        {
          "name": "newStakeAccountCustody",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "custody"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "new_stake_account_positions"
              }
            ]
          }
        },
        {
          "name": "newCustodyAuthority",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK : This AccountInfo is safe because it's a checked PDA"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "authority"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "new_stake_account_positions"
              }
            ]
          }
        },
        {
          "name": "newVoterRecord",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "voter_weight"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "new_stake_account_positions"
              }
            ]
          }
        },
        {
          "name": "config",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "config"
              }
            ]
          }
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "recipient",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "joinDaoLlc",
      "docs": [
        "* Accept to join the DAO LLC\n     * This must happen before create_position or update_voter_weight\n     * The user signs a hash of the agreement and the program checks that the hash matches the agreement"
      ],
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "stakeAccountPositions",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "stakeAccountMetadata",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "stake_metadata"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "stake_account_positions"
              }
            ]
          }
        },
        {
          "name": "config",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "config"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "agreementHash",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "globalConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "governanceAuthority",
            "type": "publicKey"
          },
          {
            "name": "pythTokenMint",
            "type": "publicKey"
          },
          {
            "name": "pythGovernanceRealm",
            "type": "publicKey"
          },
          {
            "name": "unlockingDuration",
            "type": "u8"
          },
          {
            "name": "epochDuration",
            "type": "u64"
          },
          {
            "name": "freeze",
            "type": "bool"
          },
          {
            "name": "pdaAuthority",
            "type": "publicKey"
          },
          {
            "name": "governanceProgram",
            "type": "publicKey"
          },
          {
            "name": "pythTokenListTime",
            "docs": [
              "Once the pyth token is listed, governance can update the config to set this value.",
              "Once this value is set, vesting schedules that depend on the token list date can start",
              "vesting."
            ],
            "type": {
              "option": "i64"
            }
          },
          {
            "name": "agreementHash",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "mockClockTime",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "maxVoterWeightRecord",
      "docs": [
        "Copied this struct from https://github.com/solana-labs/solana-program-library/blob/master/governance/addin-api/src/max_voter_weight.rs"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "realm",
            "docs": [
              "The Realm the MaxVoterWeightRecord belongs to"
            ],
            "type": "publicKey"
          },
          {
            "name": "governingTokenMint",
            "docs": [
              "Governing Token Mint the MaxVoterWeightRecord is associated with",
              "Note: The addin can take deposits of any tokens and is not restricted to the community or",
              "council tokens only"
            ],
            "type": "publicKey"
          },
          {
            "name": "maxVoterWeight",
            "docs": [
              "Max voter weight",
              "The max voter weight provided by the addin for the given realm and governing_token_mint"
            ],
            "type": "u64"
          },
          {
            "name": "maxVoterWeightExpiry",
            "docs": [
              "The slot when the max voting weight expires",
              "It should be set to None if the weight never expires",
              "If the max vote weight decays with time, for example for time locked based weights, then",
              "the expiry must be set As a pattern Revise instruction to update the max weight should",
              "be invoked before governance instruction within the same transaction and the expiry set",
              "to the current slot to provide up to date weight"
            ],
            "type": {
              "option": "u64"
            }
          },
          {
            "name": "reserved",
            "docs": [
              "Reserved space for future versions"
            ],
            "type": {
              "array": [
                "u8",
                8
              ]
            }
          }
        ]
      }
    },
    {
      "name": "positionData",
      "docs": [
        "An array that contains all of a user's positions i.e. where are the staking and who are they",
        "staking to.",
        "The invariant we preserve is : For i < next_index, positions[i] == Some",
        "For i >= next_index, positions[i] == None"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "positions",
            "type": {
              "array": [
                {
                  "array": [
                    "u8",
                    200
                  ]
                },
                20
              ]
            }
          }
        ]
      }
    },
    {
      "name": "splitRequest",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "recipient",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "stakeAccountMetadataV2",
      "docs": [
        "This is the metadata account for each staker",
        "It is derived from the positions account with seeds \"stake_metadata\" and the positions account",
        "pubkey It stores some PDA bumps, the owner of the account and the vesting schedule"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "metadataBump",
            "type": "u8"
          },
          {
            "name": "custodyBump",
            "type": "u8"
          },
          {
            "name": "authorityBump",
            "type": "u8"
          },
          {
            "name": "voterBump",
            "type": "u8"
          },
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "lock",
            "type": {
              "defined": "VestingSchedule"
            }
          },
          {
            "name": "nextIndex",
            "type": "u8"
          },
          {
            "name": "transferEpoch",
            "type": {
              "option": "u64"
            }
          },
          {
            "name": "signedAgreementHash",
            "type": {
              "option": {
                "array": [
                  "u8",
                  32
                ]
              }
            }
          }
        ]
      }
    },
    {
      "name": "targetMetadata",
      "docs": [
        "This represents a target that users can stake to",
        "Currently we store the last time the target account was updated, the current locked balance",
        "and the amount by which the locked balance will change in the next epoch"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "lastUpdateAt",
            "type": "u64"
          },
          {
            "name": "prevEpochLocked",
            "type": "u64"
          },
          {
            "name": "locked",
            "type": "u64"
          },
          {
            "name": "deltaLocked",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "voterWeightRecord",
      "docs": [
        "Copied this struct from https://github.com/solana-labs/solana-program-library/blob/master/governance/addin-api/src/voter_weight.rs",
        "Anchor has a macro (vote_weight_record) that is supposed to generate this struct, but it doesn't",
        "work because the error's macros are not updated for anchor 0.22.0.",
        "Even if it did work, the type wouldn't show up in the IDL. SPL doesn't produce an API, which",
        "means that means we'd need the equivalent of this code on the client side.",
        "If Anchor fixes the macro, we might consider changing it"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "realm",
            "docs": [
              "VoterWeightRecord discriminator sha256(\"account:VoterWeightRecord\")[..8]",
              "Note: The discriminator size must match the addin implementing program discriminator size",
              "to ensure it's stored in the private space of the account data and it's unique",
              "pub account_discriminator: [u8; 8],",
              "The Realm the VoterWeightRecord belongs to"
            ],
            "type": "publicKey"
          },
          {
            "name": "governingTokenMint",
            "docs": [
              "Governing Token Mint the VoterWeightRecord is associated with",
              "Note: The addin can take deposits of any tokens and is not restricted to the community or",
              "council tokens only"
            ],
            "type": "publicKey"
          },
          {
            "name": "governingTokenOwner",
            "docs": [
              "The owner of the governing token and voter",
              "This is the actual owner (voter) and corresponds to TokenOwnerRecord.governing_token_owner"
            ],
            "type": "publicKey"
          },
          {
            "name": "voterWeight",
            "docs": [
              "Voter's weight",
              "The weight of the voter provided by the addin for the given realm, governing_token_mint and",
              "governing_token_owner (voter)"
            ],
            "type": "u64"
          },
          {
            "name": "voterWeightExpiry",
            "docs": [
              "The slot when the voting weight expires",
              "It should be set to None if the weight never expires",
              "If the voter weight decays with time, for example for time locked based weights, then the",
              "expiry must be set As a common pattern Revise instruction to update the weight should",
              "be invoked before governance instruction within the same transaction and the expiry set",
              "to the current slot to provide up to date weight"
            ],
            "type": {
              "option": "u64"
            }
          },
          {
            "name": "weightAction",
            "docs": [
              "The governance action the voter's weight pertains to",
              "It allows to provided voter's weight specific to the particular action the weight is",
              "evaluated for When the action is provided then the governance program asserts the",
              "executing action is the same as specified by the addin"
            ],
            "type": {
              "option": {
                "defined": "VoterWeightAction"
              }
            }
          },
          {
            "name": "weightActionTarget",
            "docs": [
              "The target the voter's weight  action pertains to",
              "It allows to provided voter's weight specific to the target the weight is evaluated for",
              "For example when addin supplies weight to vote on a particular proposal then it must",
              "specify the proposal as the action target When the target is provided then the",
              "governance program asserts the target is the same as specified by the addin"
            ],
            "type": {
              "option": "publicKey"
            }
          },
          {
            "name": "reserved",
            "docs": [
              "Reserved space for future versions"
            ],
            "type": {
              "array": [
                "u8",
                8
              ]
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "Position",
      "docs": [
        "This represents a staking position, i.e. an amount that someone has staked to a particular",
        "target. This is one of the core pieces of our staking design, and stores all",
        "of the state related to a position The voting position is a position where the",
        "target_with_parameters is VOTING"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "activationEpoch",
            "type": "u64"
          },
          {
            "name": "unlockingStart",
            "type": {
              "option": "u64"
            }
          },
          {
            "name": "targetWithParameters",
            "type": {
              "defined": "TargetWithParameters"
            }
          }
        ]
      }
    },
    {
      "name": "Target",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Voting"
          },
          {
            "name": "Staking",
            "fields": [
              {
                "name": "product",
                "type": "publicKey"
              }
            ]
          }
        ]
      }
    },
    {
      "name": "TargetWithParameters",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Voting"
          },
          {
            "name": "Staking",
            "fields": [
              {
                "name": "product",
                "type": "publicKey"
              },
              {
                "name": "publisher",
                "type": {
                  "defined": "Publisher"
                }
              }
            ]
          }
        ]
      }
    },
    {
      "name": "Publisher",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "DEFAULT"
          },
          {
            "name": "SOME",
            "fields": [
              {
                "name": "address",
                "type": "publicKey"
              }
            ]
          }
        ]
      }
    },
    {
      "name": "PositionState",
      "docs": [
        "The core states that a position can be in"
      ],
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "UNLOCKED"
          },
          {
            "name": "LOCKING"
          },
          {
            "name": "LOCKED"
          },
          {
            "name": "PREUNLOCKING"
          },
          {
            "name": "UNLOCKING"
          }
        ]
      }
    },
    {
      "name": "VestingSchedule",
      "docs": [
        "Represents how a given initial balance vests over time",
        "It is unit-less, but units must be consistent"
      ],
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "FullyVested"
          },
          {
            "name": "PeriodicVesting",
            "fields": [
              {
                "name": "initialBalance",
                "type": "u64"
              },
              {
                "name": "startDate",
                "type": "i64"
              },
              {
                "name": "periodDuration",
                "type": "u64"
              },
              {
                "name": "numPeriods",
                "type": "u64"
              }
            ]
          },
          {
            "name": "PeriodicVestingAfterListing",
            "fields": [
              {
                "name": "initialBalance",
                "type": "u64"
              },
              {
                "name": "periodDuration",
                "type": "u64"
              },
              {
                "name": "numPeriods",
                "type": "u64"
              }
            ]
          }
        ]
      }
    },
    {
      "name": "VoterWeightAction",
      "docs": [
        "The governance action VoterWeight is evaluated for"
      ],
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "CastVote"
          },
          {
            "name": "CommentProposal"
          },
          {
            "name": "CreateGovernance"
          },
          {
            "name": "CreateProposal"
          },
          {
            "name": "SignOffProposal"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "TooMuchExposureToProduct",
      "msg": "Too much exposure to product"
    },
    {
      "code": 6001,
      "name": "TooMuchExposureToGovernance",
      "msg": "Too much exposure to governance"
    },
    {
      "code": 6002,
      "name": "TokensNotYetVested",
      "msg": "Tokens not yet vested"
    },
    {
      "code": 6003,
      "name": "RiskLimitExceeded",
      "msg": "Risk limit exceeded"
    },
    {
      "code": 6004,
      "name": "TooManyPositions",
      "msg": "Number of position limit reached"
    },
    {
      "code": 6005,
      "name": "PositionNotInUse",
      "msg": "Position not in use"
    },
    {
      "code": 6006,
      "name": "CreatePositionWithZero",
      "msg": "New position needs to have positive balance"
    },
    {
      "code": 6007,
      "name": "ClosePositionWithZero",
      "msg": "Closing a position of 0 is not allowed"
    },
    {
      "code": 6008,
      "name": "InvalidPosition",
      "msg": "Invalid product/publisher pair"
    },
    {
      "code": 6009,
      "name": "AmountBiggerThanPosition",
      "msg": "Amount to unlock bigger than position"
    },
    {
      "code": 6010,
      "name": "AlreadyUnlocking",
      "msg": "Position already unlocking"
    },
    {
      "code": 6011,
      "name": "ZeroEpochDuration",
      "msg": "Epoch duration is 0"
    },
    {
      "code": 6012,
      "name": "WithdrawToUnauthorizedAccount",
      "msg": "Owner needs to own destination account"
    },
    {
      "code": 6013,
      "name": "InsufficientWithdrawableBalance",
      "msg": "Insufficient balance to cover the withdrawal"
    },
    {
      "code": 6014,
      "name": "WrongTarget",
      "msg": "Target in position doesn't match target in instruction data"
    },
    {
      "code": 6015,
      "name": "GenericOverflow",
      "msg": "An arithmetic operation unexpectedly overflowed"
    },
    {
      "code": 6016,
      "name": "NegativeBalance",
      "msg": "Locked balance must be positive"
    },
    {
      "code": 6017,
      "name": "Frozen",
      "msg": "Protocol is frozen"
    },
    {
      "code": 6018,
      "name": "DebuggingOnly",
      "msg": "Not allowed when not debugging"
    },
    {
      "code": 6019,
      "name": "ProposalTooLong",
      "msg": "Proposal too long"
    },
    {
      "code": 6020,
      "name": "InvalidVotingEpoch",
      "msg": "Voting epoch is either too old or hasn't started"
    },
    {
      "code": 6021,
      "name": "ProposalNotActive",
      "msg": "Voting hasn't started"
    },
    {
      "code": 6022,
      "name": "NoRemainingAccount",
      "msg": "Extra governance account required"
    },
    {
      "code": 6023,
      "name": "Unauthorized",
      "msg": "Unauthorized caller"
    },
    {
      "code": 6024,
      "name": "AccountUpgradeFailed",
      "msg": "Precondition to upgrade account violated"
    },
    {
      "code": 6025,
      "name": "NotImplemented",
      "msg": "Not implemented"
    },
    {
      "code": 6026,
      "name": "PositionSerDe",
      "msg": "Error deserializing position"
    },
    {
      "code": 6027,
      "name": "PositionOutOfBounds",
      "msg": "Position out of bounds"
    },
    {
      "code": 6028,
      "name": "VoteDuringTransferEpoch",
      "msg": "Can't vote during an account's transfer epoch"
    },
    {
      "code": 6029,
      "name": "NotLlcMember",
      "msg": "You need to be an LLC member to perform this action"
    },
    {
      "code": 6030,
      "name": "InvalidLlcAgreement",
      "msg": "Invalid LLC agreement"
    },
    {
      "code": 6031,
      "name": "SplitZeroTokens",
      "msg": "Can't split 0 tokens from an account"
    },
    {
      "code": 6032,
      "name": "SplitTooManyTokens",
      "msg": "Can't split more tokens than are in the account"
    },
    {
      "code": 6033,
      "name": "SplitWithStake",
      "msg": "Can't split a token account with staking positions. Unstake your tokens first."
    },
    {
      "code": 6034,
      "name": "InvalidApproval",
      "msg": "The approval arguments do not match the split request."
    },
    {
      "code": 6035,
      "name": "Other",
      "msg": "Other"
    }
  ]
};
