variable "region_selection" {
  type        = string
  description = "Generic region: us, eu, or ap"
  default     = "us"
}

variable "tier_selection" {
  type        = string
  description = "Machine tier: small or medium"
  default     = "small"
}

variable "node_count" {
  type        = number
  description = "Number of worker nodes per cluster"
  default     = 2
}