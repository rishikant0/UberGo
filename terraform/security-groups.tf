# ==========================================
# Jenkins Security Group
# ==========================================

resource "aws_security_group" "jenkins" {
  name        = "ubargo-jenkins-sg"
  description = "Security group for UberGo Jenkins"
  vpc_id      = aws_vpc.ubargo.id

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Jenkins Web UI"
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "ubargo-jenkins-sg"
  }
}

# ==========================================
# SonarQube Security Group
# ==========================================

resource "aws_security_group" "sonarqube" {
  name        = "ubargo-sonarqube-sg"
  description = "Security group for UberGo SonarQube"
  vpc_id      = aws_vpc.ubargo.id

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "SonarQube Web UI"
    from_port   = 9000
    to_port     = 9000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "ubargo-sonarqube-sg"
  }
}
