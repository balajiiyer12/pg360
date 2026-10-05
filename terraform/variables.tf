variable "primary_region" {
  type        = string
  description = "Primary GKE region"
  default     = "us-central1"
}

variable "secondary_region" {
  type        = string
  description = "Secondary GKE region"
  default     = "us-east1"
}

variable "tier_selection" {
  type        = string
  description = "Machine tier"
  default     = "small"
}

variable "node_count" {
  type        = number
  description = "Number of nodes per cluster"
  default     = 1
}