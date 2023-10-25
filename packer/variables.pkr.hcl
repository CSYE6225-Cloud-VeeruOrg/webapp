variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "source_ami" {
  type    = string
  default = "ami-06db4d78cb1d3bbf9"
}

variable "ssh_username" {
  type    = string
  default = "admin"
}

variable "subnet_id" {
  type    = string
  default = "subnet-0f53294986bc969b6"
}

variable "artifact" {
  type    = string
  default = ""
}

variable "ami_users" {
  type = list(string)
  default = [
    "042700404980",
  ]
}

variable "ami_regions" {
  type = list(string)
  default = [
    "us-east-1",
  ]
}