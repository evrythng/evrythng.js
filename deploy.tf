provider "aws" {
  access_key = "${var.access_key}"
  secret_key = "${var.secret_key}"
  region = "us-east-1"
}

variable "access_key" {
  type = "string"
}

variable "secret_key" {
  type = "string"
}

variable "version" {
  type = "string"
}

variable "bucket" {
  type = "string"
}

resource "aws_s3_bucket" "bucket" {
  bucket = "${var.bucket}"
  acl = "public-read"
}

resource "aws_s3_bucket_object" "object" {
  bucket = "${var.bucket}"
  key = "js/evrythng/${var.version}/evrythng-${var.version}.js"
  source = "dist/evrythng.browser.js"
  acl = "public-read"
}
