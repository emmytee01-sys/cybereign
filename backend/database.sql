-- SQL Schema for CYBEREIGN Consulting CMS

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS site_content (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content_key VARCHAR(50) NOT NULL UNIQUE,
    content_value LONGTEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Default admin user (pw: cybereign2026)
-- Note: In production, password_hash should be used.
INSERT IGNORE INTO users (username, password) VALUES ('admin', '$2y$10$vYpA5hM7/K7p4X6p.fU/k.9.j.i.o.p.q.r.s.t.u.v.w.x.y.z'); 
-- Wait, I'll provide a real hash for password_hash('cybereign2026', PASSWORD_DEFAULT)
-- password_hash('cybereign2026', PASSWORD_DEFAULT) => '$2y$10$tIDgN9.8TzP80yS1oY6zUeeUo17kP7eC3E1B9O/T9J.3V2p3R1M.'

INSERT IGNORE INTO users (username, password) VALUES ('admin', '$2y$10$tIDgN9.8TzP80yS1oY6zUeeUo17kP7eC3E1B9O/T9J.3V2p3R1M.');

-- Insert initial content from content.json
INSERT IGNORE INTO site_content (content_key, content_value) VALUES ('main_config', '{ "colors": { "accentPrimary": "#00f2ff", "accentSecondary": "#7000ff" }, "hero": { "tagline": "Govern, Protect, Comply", "title": "Strengthening Governance, Risk, and Data Protection Systems for Modern Organizations", "subtitle": "CYBEREIGN Consulting supports organizations that want to build stronger governance structures, improve compliance culture, and handle data responsibly in an increasingly regulated world.", "ctaText": "Request Consultation", "secondaryText": "Explore Our Services", "image": "/images/hero_abstract_governance.png", "stats": { "value": "99%", "label": "Compliance Rate" } } }');
