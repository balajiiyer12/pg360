provider "google" {
  project = "pg360-508113"
  region  = var.primary_region
}

# 1. Frontend Storage Bucket (Fixed with uniform bucket-level access)
resource "google_storage_bucket" "frontend" {
  name                        = "my-frontend-bucket-${var.primary_region}-v2"
  location                    = var.primary_region
  force_destroy               = true
  uniform_bucket_level_access = true
}

# 2. GKE Cluster Primary
resource "google_container_cluster" "gke_primary" {
  name               = "gke-primary"
  location           = var.primary_region
  initial_node_count = var.node_count

  deletion_protection = false

  node_config {
    machine_type = local.active_machine_type
  }
}

# 3. GKE Cluster Secondary
resource "google_container_cluster" "gke_secondary" {
  name               = "gke-secondary"
  location           = var.secondary_region
  initial_node_count = var.node_count

  deletion_protection = false

  node_config {
    machine_type = local.active_machine_type
  }
}

# 4. Cloud SQL Database
resource "google_sql_database_instance" "postgres" {
  name             = "cloudsql-main"
  region           = var.primary_region
  database_version = "POSTGRES_15"

  deletion_protection = false

  settings {
    tier = "db-f1-micro"
  }
}