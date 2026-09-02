# -----------------------------
# UberGo VPC
# -----------------------------

locals {
  availability_zones = [
    "ap-south-1a",
    "ap-south-1b"
  ]
}

resource "aws_vpc" "ubargo" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "ubargo-vpc"
  }
}

# -----------------------------
# Internet Gateway
# -----------------------------

resource "aws_internet_gateway" "ubargo" {
  vpc_id = aws_vpc.ubargo.id

  tags = {
    Name = "ubargo-igw"
  }
}

# -----------------------------
# Public Subnets
# -----------------------------

resource "aws_subnet" "public" {
  count = 2

  vpc_id                  = aws_vpc.ubargo.id
  cidr_block              = "10.0.${count.index + 1}.0/24"
  availability_zone       = local.availability_zones[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name = "ubargo-public-${count.index + 1}"
    Type = "public"
  }
}

# -----------------------------
# Private Subnets
# -----------------------------

resource "aws_subnet" "private" {
  count = 2

  vpc_id            = aws_vpc.ubargo.id
  cidr_block        = "10.0.${count.index + 11}.0/24"
  availability_zone = local.availability_zones[count.index]

  tags = {
    Name = "ubargo-private-${count.index + 1}"
    Type = "private"
  }
}

# -----------------------------
# Public Route Table
# -----------------------------

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.ubargo.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.ubargo.id
  }

  tags = {
    Name = "ubargo-public-rt"
  }
}

resource "aws_route_table_association" "public" {
  count = 2

  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

# -----------------------------
# Single Elastic IP for NAT
# -----------------------------

resource "aws_eip" "nat" {
  domain = "vpc"

  tags = {
    Name = "ubargo-nat-eip"
  }
}

# -----------------------------
# Single NAT Gateway
# -----------------------------

resource "aws_nat_gateway" "ubargo" {
  allocation_id = aws_eip.nat.id
  subnet_id     = aws_subnet.public[0].id

  depends_on = [
    aws_internet_gateway.ubargo
  ]

  tags = {
    Name = "ubargo-nat"
  }
}

# -----------------------------
# Private Route Tables
# -----------------------------

resource "aws_route_table" "private" {
  count = 2

  vpc_id = aws_vpc.ubargo.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.ubargo.id
  }

  tags = {
    Name = "ubargo-private-rt-${count.index + 1}"
  }
}

resource "aws_route_table_association" "private" {
  count = 2

  subnet_id      = aws_subnet.private[count.index].id
  route_table_id = aws_route_table.private[count.index].id
}
