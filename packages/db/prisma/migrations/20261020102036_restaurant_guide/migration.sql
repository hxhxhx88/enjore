-- CreateTable
CREATE TABLE "translations" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "locale" TEXT NOT NULL,
    "table" TEXT NOT NULL,
    "record_id" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chains" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "name_locale" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "chains_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "restaurants" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chain_id" TEXT,
    "name" TEXT NOT NULL,
    "name_locale" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "place_id" TEXT,
    "places_refreshed_at" TIMESTAMPTZ,
    "address" TEXT,
    "address_origin" TEXT NOT NULL DEFAULT 'places',
    "district" TEXT,
    "district_origin" TEXT NOT NULL DEFAULT 'places',
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "coordinates_origin" TEXT NOT NULL DEFAULT 'places',
    "phone" TEXT,
    "phone_origin" TEXT NOT NULL DEFAULT 'places',
    "website" TEXT,
    "website_origin" TEXT NOT NULL DEFAULT 'places',
    "opening_hours" JSONB,
    "opening_hours_origin" TEXT NOT NULL DEFAULT 'places',
    "business_status" TEXT,
    "business_status_origin" TEXT NOT NULL DEFAULT 'places',
    "structured_profile_locked_fields" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "withdrawn_at" TIMESTAMPTZ,

    CONSTRAINT "restaurants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "restaurant_profiles" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "restaurant_id" TEXT NOT NULL,
    "poster_artwork_id" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "article" TEXT,
    "canonical_description" TEXT,
    "poster_brief" TEXT,
    "structured_profile" JSONB,
    "menu" JSONB,

    CONSTRAINT "restaurant_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "restaurant_profile_drafts" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "restaurant_id" TEXT NOT NULL,
    "poster_artwork_id" TEXT,
    "locale" TEXT NOT NULL,
    "summary" TEXT,
    "article" TEXT,
    "canonical_description" TEXT,
    "poster_brief" TEXT,
    "structured_profile" JSONB,
    "menu" JSONB,
    "reviewed_at" TIMESTAMPTZ,

    CONSTRAINT "restaurant_profile_drafts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "poster_artworks" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "restaurant_id" TEXT NOT NULL,
    "attempt_id" TEXT,
    "url" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "brief" TEXT,
    "rejection_reason" TEXT,

    CONSTRAINT "poster_artworks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "restaurant_archives" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "restaurant_id" TEXT NOT NULL,
    "survivor_id" TEXT,
    "reason" TEXT NOT NULL,

    CONSTRAINT "restaurant_archives_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "restaurant_links" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "restaurant_id" TEXT NOT NULL,
    "attempt_id" TEXT,
    "platform" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "restaurant_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "source_references" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "restaurant_id" TEXT NOT NULL,
    "award_id" TEXT NOT NULL,
    "listing_url" TEXT NOT NULL,

    CONSTRAINT "source_references_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "awards" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "name_locale" TEXT NOT NULL,
    "short_name" TEXT,
    "slug" TEXT NOT NULL,
    "website" TEXT,
    "has_tier" BOOLEAN NOT NULL DEFAULT false,
    "has_rank" BOOLEAN NOT NULL DEFAULT false,
    "has_label" BOOLEAN NOT NULL DEFAULT false,
    "score_max" DOUBLE PRECISION,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "awards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "award_tiers" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "award_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "glyph_key" TEXT NOT NULL,
    "glyph_count" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "award_tiers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "award_editions" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "award_id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "region" TEXT,
    "source_url" TEXT,
    "expected_count" INTEGER,
    "found_count" INTEGER,
    "notes" TEXT,
    "imported_at" TIMESTAMPTZ,
    "verified_at" TIMESTAMPTZ,

    CONSTRAINT "award_editions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accolades" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "restaurant_id" TEXT NOT NULL,
    "award_id" TEXT NOT NULL,
    "edition_id" TEXT NOT NULL,
    "tier_id" TEXT,
    "attempt_id" TEXT,
    "import_entry_id" TEXT,
    "rank" INTEGER,
    "score" DOUBLE PRECISION,
    "label" TEXT,
    "reference_url" TEXT NOT NULL,
    "note" TEXT,
    "verified_at" TIMESTAMPTZ,

    CONSTRAINT "accolades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "import_entries" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "edition_id" TEXT NOT NULL,
    "attempt_id" TEXT,
    "restaurant_id" TEXT,
    "payload" JSONB NOT NULL,
    "place_id" TEXT,
    "candidates" JSONB NOT NULL DEFAULT '[]',
    "discarded_at" TIMESTAMPTZ,

    CONSTRAINT "import_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "runner_tokens" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "token_hash" TEXT NOT NULL,
    "last_used_at" TIMESTAMPTZ,
    "revoked_at" TIMESTAMPTZ,

    CONSTRAINT "runner_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jobs" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "restaurant_id" TEXT,
    "edition_id" TEXT,
    "import_entry_id" TEXT,
    "kind" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "priority" INTEGER NOT NULL,
    "payload" JSONB NOT NULL,
    "lease_expires_at" TIMESTAMPTZ,
    "result" JSONB,
    "error" TEXT,
    "started_at" TIMESTAMPTZ,
    "finished_at" TIMESTAMPTZ,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_attempts" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "job_id" TEXT NOT NULL,
    "runner_token_id" TEXT,
    "prompt" TEXT,
    "session_url" TEXT,
    "trigger_run_id" TEXT,
    "finished_at" TIMESTAMPTZ,
    "error" TEXT,

    CONSTRAINT "job_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_tool_calls" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "attempt_id" TEXT NOT NULL,
    "tool" TEXT NOT NULL,
    "input" JSONB NOT NULL,
    "output" JSONB,
    "error" TEXT,
    "duration_ms" INTEGER,

    CONSTRAINT "job_tool_calls_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "translations_table_record_id_idx" ON "translations"("table", "record_id");

-- CreateIndex
CREATE UNIQUE INDEX "translations_locale_table_record_id_field_key" ON "translations"("locale", "table", "record_id", "field");

-- CreateIndex
CREATE UNIQUE INDEX "chains_slug_key" ON "chains"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "restaurants_slug_key" ON "restaurants"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "restaurants_place_id_key" ON "restaurants"("place_id");

-- CreateIndex
CREATE INDEX "restaurants_chain_id_idx" ON "restaurants"("chain_id");

-- CreateIndex
CREATE INDEX "restaurants_region_idx" ON "restaurants"("region");

-- CreateIndex
CREATE UNIQUE INDEX "restaurant_profiles_restaurant_id_key" ON "restaurant_profiles"("restaurant_id");

-- CreateIndex
CREATE UNIQUE INDEX "restaurant_profiles_restaurant_id_poster_artwork_id_key" ON "restaurant_profiles"("restaurant_id", "poster_artwork_id");

-- CreateIndex
CREATE UNIQUE INDEX "restaurant_profile_drafts_restaurant_id_key" ON "restaurant_profile_drafts"("restaurant_id");

-- CreateIndex
CREATE UNIQUE INDEX "restaurant_profile_drafts_restaurant_id_poster_artwork_id_key" ON "restaurant_profile_drafts"("restaurant_id", "poster_artwork_id");

-- CreateIndex
CREATE UNIQUE INDEX "poster_artworks_url_key" ON "poster_artworks"("url");

-- CreateIndex
CREATE INDEX "poster_artworks_attempt_id_idx" ON "poster_artworks"("attempt_id");

-- CreateIndex
CREATE UNIQUE INDEX "poster_artworks_restaurant_id_id_key" ON "poster_artworks"("restaurant_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "restaurant_archives_restaurant_id_key" ON "restaurant_archives"("restaurant_id");

-- CreateIndex
CREATE INDEX "restaurant_archives_survivor_id_idx" ON "restaurant_archives"("survivor_id");

-- CreateIndex
CREATE INDEX "restaurant_links_attempt_id_idx" ON "restaurant_links"("attempt_id");

-- CreateIndex
CREATE UNIQUE INDEX "restaurant_links_restaurant_id_platform_key" ON "restaurant_links"("restaurant_id", "platform");

-- CreateIndex
CREATE INDEX "source_references_restaurant_id_idx" ON "source_references"("restaurant_id");

-- CreateIndex
CREATE UNIQUE INDEX "source_references_award_id_listing_url_key" ON "source_references"("award_id", "listing_url");

-- CreateIndex
CREATE UNIQUE INDEX "awards_slug_key" ON "awards"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "award_tiers_award_id_name_key" ON "award_tiers"("award_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "award_tiers_award_id_id_key" ON "award_tiers"("award_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "award_editions_award_id_label_key" ON "award_editions"("award_id", "label");

-- CreateIndex
CREATE UNIQUE INDEX "award_editions_award_id_id_key" ON "award_editions"("award_id", "id");

-- CreateIndex
CREATE INDEX "accolades_award_id_idx" ON "accolades"("award_id");

-- CreateIndex
CREATE INDEX "accolades_edition_id_idx" ON "accolades"("edition_id");

-- CreateIndex
CREATE INDEX "accolades_tier_id_idx" ON "accolades"("tier_id");

-- CreateIndex
CREATE INDEX "accolades_attempt_id_idx" ON "accolades"("attempt_id");

-- CreateIndex
CREATE INDEX "accolades_import_entry_id_idx" ON "accolades"("import_entry_id");

-- CreateIndex
CREATE UNIQUE INDEX "accolades_restaurant_id_edition_id_tier_id_key" ON "accolades"("restaurant_id", "edition_id", "tier_id");

-- CreateIndex
CREATE INDEX "import_entries_edition_id_idx" ON "import_entries"("edition_id");

-- CreateIndex
CREATE INDEX "import_entries_attempt_id_idx" ON "import_entries"("attempt_id");

-- CreateIndex
CREATE INDEX "import_entries_restaurant_id_idx" ON "import_entries"("restaurant_id");

-- CreateIndex
CREATE UNIQUE INDEX "runner_tokens_token_hash_key" ON "runner_tokens"("token_hash");

-- CreateIndex
CREATE INDEX "jobs_status_priority_created_at_idx" ON "jobs"("status", "priority", "created_at");

-- CreateIndex
CREATE INDEX "jobs_kind_idx" ON "jobs"("kind");

-- CreateIndex
CREATE INDEX "jobs_restaurant_id_idx" ON "jobs"("restaurant_id");

-- CreateIndex
CREATE INDEX "jobs_edition_id_idx" ON "jobs"("edition_id");

-- CreateIndex
CREATE INDEX "jobs_import_entry_id_idx" ON "jobs"("import_entry_id");

-- CreateIndex
CREATE INDEX "job_attempts_job_id_idx" ON "job_attempts"("job_id");

-- CreateIndex
CREATE INDEX "job_attempts_runner_token_id_idx" ON "job_attempts"("runner_token_id");

-- CreateIndex
CREATE INDEX "job_tool_calls_attempt_id_idx" ON "job_tool_calls"("attempt_id");

-- AddForeignKey
ALTER TABLE "restaurants" ADD CONSTRAINT "restaurants_chain_id_fkey" FOREIGN KEY ("chain_id") REFERENCES "chains"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "restaurant_profiles" ADD CONSTRAINT "restaurant_profiles_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "restaurant_profiles" ADD CONSTRAINT "restaurant_profiles_restaurant_id_poster_artwork_id_fkey" FOREIGN KEY ("restaurant_id", "poster_artwork_id") REFERENCES "poster_artworks"("restaurant_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "restaurant_profile_drafts" ADD CONSTRAINT "restaurant_profile_drafts_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "restaurant_profile_drafts" ADD CONSTRAINT "restaurant_profile_drafts_restaurant_id_poster_artwork_id_fkey" FOREIGN KEY ("restaurant_id", "poster_artwork_id") REFERENCES "poster_artworks"("restaurant_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "poster_artworks" ADD CONSTRAINT "poster_artworks_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "poster_artworks" ADD CONSTRAINT "poster_artworks_attempt_id_fkey" FOREIGN KEY ("attempt_id") REFERENCES "job_attempts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "restaurant_archives" ADD CONSTRAINT "restaurant_archives_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "restaurant_archives" ADD CONSTRAINT "restaurant_archives_survivor_id_fkey" FOREIGN KEY ("survivor_id") REFERENCES "restaurants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "restaurant_links" ADD CONSTRAINT "restaurant_links_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "restaurant_links" ADD CONSTRAINT "restaurant_links_attempt_id_fkey" FOREIGN KEY ("attempt_id") REFERENCES "job_attempts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "source_references" ADD CONSTRAINT "source_references_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "source_references" ADD CONSTRAINT "source_references_award_id_fkey" FOREIGN KEY ("award_id") REFERENCES "awards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "award_tiers" ADD CONSTRAINT "award_tiers_award_id_fkey" FOREIGN KEY ("award_id") REFERENCES "awards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "award_editions" ADD CONSTRAINT "award_editions_award_id_fkey" FOREIGN KEY ("award_id") REFERENCES "awards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accolades" ADD CONSTRAINT "accolades_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accolades" ADD CONSTRAINT "accolades_award_id_edition_id_fkey" FOREIGN KEY ("award_id", "edition_id") REFERENCES "award_editions"("award_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accolades" ADD CONSTRAINT "accolades_award_id_tier_id_fkey" FOREIGN KEY ("award_id", "tier_id") REFERENCES "award_tiers"("award_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accolades" ADD CONSTRAINT "accolades_attempt_id_fkey" FOREIGN KEY ("attempt_id") REFERENCES "job_attempts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accolades" ADD CONSTRAINT "accolades_import_entry_id_fkey" FOREIGN KEY ("import_entry_id") REFERENCES "import_entries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "import_entries" ADD CONSTRAINT "import_entries_edition_id_fkey" FOREIGN KEY ("edition_id") REFERENCES "award_editions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "import_entries" ADD CONSTRAINT "import_entries_attempt_id_fkey" FOREIGN KEY ("attempt_id") REFERENCES "job_attempts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "import_entries" ADD CONSTRAINT "import_entries_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_edition_id_fkey" FOREIGN KEY ("edition_id") REFERENCES "award_editions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_import_entry_id_fkey" FOREIGN KEY ("import_entry_id") REFERENCES "import_entries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_attempts" ADD CONSTRAINT "job_attempts_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_attempts" ADD CONSTRAINT "job_attempts_runner_token_id_fkey" FOREIGN KEY ("runner_token_id") REFERENCES "runner_tokens"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_tool_calls" ADD CONSTRAINT "job_tool_calls_attempt_id_fkey" FOREIGN KEY ("attempt_id") REFERENCES "job_attempts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
