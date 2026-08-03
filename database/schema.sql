-- MT5 Monitor Pro Database Schema v1.0

PRAGMA foreign_keys = ON;

-- ===========================
-- Users
-- ===========================
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ===========================
-- Trading Accounts
-- ===========================
CREATE TABLE IF NOT EXISTS accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    login INTEGER NOT NULL UNIQUE,
    broker TEXT,
    server TEXT,
    name TEXT,

    balance REAL DEFAULT 0,
    equity REAL DEFAULT 0,
    margin REAL DEFAULT 0,
    free_margin REAL DEFAULT 0,
    margin_level REAL DEFAULT 0,

    leverage INTEGER DEFAULT 0,

    currency TEXT DEFAULT 'USD',

    floating_profit REAL DEFAULT 0,

    connected INTEGER DEFAULT 1,

    updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_accounts_login
ON accounts(login);

-- ===========================
-- Open Positions
-- ===========================
CREATE TABLE IF NOT EXISTS positions (
    ticket INTEGER PRIMARY KEY,

    account_login INTEGER NOT NULL,

    symbol TEXT,

    type INTEGER,

    volume REAL,

    open_price REAL,

    current_price REAL,

    sl REAL,

    tp REAL,

    profit REAL,

    swap REAL,

    commission REAL,

    open_time TEXT,

    updated_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_positions_account
ON positions(account_login);

-- ===========================
-- Settings
-- ===========================
CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
);

-- ===========================
-- Logs
-- ===========================
CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    level TEXT,

    message TEXT,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
-- ===========================
-- API Keys for MT5 EA
-- ===========================

CREATE TABLE IF NOT EXISTS api_keys (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    account_login INTEGER,

    api_key TEXT NOT NULL UNIQUE,

    name TEXT,

    active INTEGER DEFAULT 1,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP

);


CREATE INDEX IF NOT EXISTS idx_api_keys_key
ON api_keys(api_key);