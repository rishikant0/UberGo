output "vpc_id" {
  description = "UberGo VPC ID"
  value       = aws_vpc.ubargo.id
}

output "public_subnet_ids" {
  description = "UberGo public subnet IDs"
  value       = aws_subnet.public[*].id
}

output "private_subnet_ids" {
  description = "UberGo private subnet IDs"
  value       = aws_subnet.private[*].id
}

output "availability_zones" {
  description = "Availability zones used by UberGo"
  value       = local.availability_zones
}

output "nat_gateway_id" {
  description = "UberGo NAT Gateway ID"
  value       = aws_nat_gateway.ubargo.id
}

output "jenkins_instance_id" {
  description = "Jenkins EC2 instance ID"
  value       = aws_instance.jenkins.id
}

output "jenkins_public_ip" {
  description = "Jenkins EC2 public IP"
  value       = aws_instance.jenkins.public_ip
}

output "sonarqube_instance_id" {
  description = "SonarQube EC2 instance ID"
  value       = aws_instance.sonarqube.id
}

output "sonarqube_public_ip" {
  description = "SonarQube EC2 public IP"
  value       = aws_instance.sonarqube.public_ip
}
