import {toChecksumAddress} from "ethereumjs-util";

export const NAME = "Dicether";
export const VERSION = process.env.VERSION || "";
export const BUILD_DATE = new Date(process.env.BUILD_DATE || new Date());

export const CONTRACT_ADDRESS = toChecksumAddress(process.env.CONTRACT_ADDRESS || "");
export const CHAIN_ID = Number.parseInt(process.env.CHAIN_ID || "", 10);
export const SIGNATURE_VERSION = 2;
export const NEW_EIP_GAME_ID = 572;
export const NEW_EIP_GAME_ID_2 = 1759;
export const OLD_EIP_GAME_ID = 638;

export const SERVER_ADDRESS = toChecksumAddress(process.env.SERVER_ADDRESS || "");

export const DISCORD_URL = "https://discord.gg/kD7FajM";
export const REDDIT_URL = "https://www.reddit.com/r/Dicether";
export const CONTRACT_URL = `https://etherscan.io/address/${CONTRACT_ADDRESS}#code`;
export const CONTACT_URL = "contact@dicether.com";
export const BUGS_URL = "bugs@dicether.com";
export const TWITTER_URL = "https://twitter.com/dicether";
export const METAMASK_URL = "https://metamask.io";
export const TRUST_WALLET_URL = "https://trustwalletapp.com";
export const COINBASE_WALLET_URL = "https://wallet.coinbase.com";
export const GITHUB_URL = "https://github.com/dicether";

export const API_URL = process.env.API_URL || "";
export const SOCKET_URL = process.env.SOCKET_URL || "";

export const REALM = "Dicether";

export const ACCOUNT_BALANCE_POLL_INTERVAL = 5000;

export const FROM_WEI_TO_BASE = 1e9; // conversion from wei to base unit GWEI
export const FROM_BASE_TO_WEI = 1e9; // conversion from base unit GWEI to wei

export const NETWORK_NAME = "Main";

export const MIN_GAME_SESSION_VALUE = 1e7;
export const MAX_GAME_SESSION_VALUE = 30e9;
export const HOUSE_EDGE = 150;
export const HOUSE_EDGE_DIVISOR = 10000;

export const MIN_BET_VALUE = 1e4;
export const MAX_BET_VALUE = 4e9;
export const MIN_BANKROLL = 9e9;
export const KELLY_FACTOR = 1;

export const RANGE = 100;
export const MIN_NUMBER_DICE_1 = 1;
export const MAX_NUMBER_DICE_1 = 98;
export const MIN_NUMBER_DICE_2 = 2;
export const MAX_NUMBER_DICE_2 = 99;

export const FORCE_END_TIMEOUT = 48; // in hours, timeout force end is possible after conflict end
export const GAME_SESSION_TIMEOUT = 6; // in hours, timeout after server will end game session with conflict end

export const MAX_BLOCKS_QUERY = 950;
