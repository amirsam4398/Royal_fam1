-- App schema for real leads, clients and subscription plans.
-- Does not touch auth tables. Existing public pages remain unchanged.

CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  role TEXT NOT NULL CHECK (role IN ('business', 'customer')),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  place_slug TEXT NOT NULL,
  service_slug TEXT NOT NULL,
  package_id TEXT NOT NULL DEFAULT 'local',
  note TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'assigned', 'contacted', 'converted', 'closed')),
  assigned_client_id TEXT,
  source TEXT DEFAULT 'site',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS leads_place_service_idx ON leads (place_slug, service_slug);
CREATE INDEX IF NOT EXISTS leads_status_idx ON leads (status);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads (created_at DESC);
CREATE INDEX IF NOT EXISTS leads_phone_idx ON leads (phone);

CREATE TABLE IF NOT EXISTS clients (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  business_name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  place_slug TEXT NOT NULL,
  service_slugs TEXT[] NOT NULL DEFAULT '{}',
  plan_id TEXT NOT NULL DEFAULT 'local',
  plan_status TEXT NOT NULL DEFAULT 'trial' CHECK (plan_status IN ('trial', 'active', 'past_due', 'cancelled')),
  plan_expires_at TIMESTAMPTZ,
  instagram_handle TEXT,
  website_url TEXT,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS clients_place_idx ON clients (place_slug);
CREATE INDEX IF NOT EXISTS clients_plan_status_idx ON clients (plan_status);
CREATE INDEX IF NOT EXISTS clients_user_id_idx ON clients (user_id);

CREATE TABLE IF NOT EXISTS subscriptions (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL REFERENCES clients (id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL,
  amount INTEGER NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'IRR',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_ref TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS subscriptions_client_idx ON subscriptions (client_id);
CREATE INDEX IF NOT EXISTS subscriptions_status_idx ON subscriptions (status);
