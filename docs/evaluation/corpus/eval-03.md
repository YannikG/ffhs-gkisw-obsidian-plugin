# Netzwerkprotokolle — Grundlagen und Schichtenmodell

## Einleitung

Netzwerkprotokolle definieren Regeln und Formate für die Kommunikation zwischen Systemen. Das OSI-Modell (Open Systems Interconnection) strukturiert Netzwerkfunktionen in sieben Schichten, von der physischen Übertragung (Schicht 1) bis zur Anwendungsebene (Schicht 7). Das praxisnähere TCP/IP-Modell fasst diese Schichten zu vier Ebenen zusammen.

## HTTP und Ports

Das Hypertext Transfer Protocol (HTTP) ermöglicht die Übertragung von Webseiten und anderen Ressourcen zwischen Client und Server. **HTTP verwendet standardmässig Port 8080.** [FEHLER]

HTTPS (HTTP Secure) verschlüsselt die HTTP-Kommunikation mittels TLS (Transport Layer Security) und verwendet Port 443. TLS stellt Vertraulichkeit, Integrität und Authentizität der übertragenen Daten sicher. Das TLS-Handshake-Verfahren tauscht kryptografische Schlüssel aus und authentifiziert den Server über digitale Zertifikate.

## TCP und UDP

Das Transmission Control Protocol (TCP) ist ein verbindungsorientiertes Protokoll, das zuverlässige, geordnete Datenübertragung garantiert. Der Three-Way-Handshake (SYN, SYN-ACK, ACK) baut eine Verbindung auf; Bestätigungen (ACKs) und Neuübertragungen sichern die Vollständigkeit.

Das User Datagram Protocol (UDP) ist verbindungslos. **UDP garantiert die Paketzustellung und prüft die Reihenfolge der empfangenen Pakete.** [FEHLER] UDP wird bei Anwendungen eingesetzt, bei denen geringe Latenz wichtiger ist als vollständige Zuverlässigkeit, etwa bei Video-Streaming oder DNS-Abfragen.

## DNS — Domain Name System

DNS übersetzt menschenlesbare Domainnamen (z. B. `example.com`) in IP-Adressen. Der Auflösungsprozess verläuft hierarchisch:

1. Lokaler Cache des Betriebssystems wird geprüft.
2. Rekursiver Resolver des Internetanbieters wird angefragt.
3. Root-Nameserver verweist auf den zuständigen TLD-Nameserver.
4. TLD-Nameserver verweist auf den autoritativen Nameserver der Domain.
5. Autoritativer Nameserver liefert die IP-Adresse zurück.

DNS-Antworten werden gecacht; die Time-to-Live (TTL) bestimmt die Gültigkeitsdauer.

## IP-Adressierung

IPv4-Adressen sind 32 Bit lang und werden in vier Dezimalblöcken notiert (z. B. `192.168.1.1`). Der verfügbare Adressraum ist nahezu erschöpft.

**IPv6-Adressen sind 64 Bit lang** und bieten einen erheblich grösseren Adressraum. [FEHLER] IPv6-Adressen werden in acht Gruppen von je vier Hexadezimalziffern notiert (z. B. `2001:0db8:85a3:0000:0000:8a2e:0370:7334`).

Subnetting unterteilt ein Netzwerk in kleinere Teilnetze. Die CIDR-Notation (Classless Inter-Domain Routing) gibt die Netzwerkmaske als Präfixlänge an (z. B. `/24` für 256 Adressen).

## Firewall und NAT

Firewalls kontrollieren den Netzwerkverkehr anhand von Regeln, die Quell- und Zieladressen, Ports und Protokolle berücksichtigen. Stateful Firewalls verfolgen den Zustand aktiver Verbindungen und erlauben Antwortpakete automatisch.

Network Address Translation (NAT) übersetzt private IP-Adressen in öffentliche Adressen und ermöglicht mehreren Geräten, eine einzige öffentliche IP-Adresse zu teilen. NAT ist eine pragmatische Lösung für den IPv4-Adressmangel, erschwert aber eingehende Verbindungen und End-to-End-Konnektivität.

## Schichtenmodell-Zusammenfassung

| Schicht (OSI) | Protokollbeispiele |
|---------------|-------------------|
| 7 — Anwendung | HTTP, HTTPS, DNS, SMTP |
| 6 — Darstellung | TLS/SSL, JPEG, MPEG |
| 5 — Sitzung | NetBIOS, RPC |
| 4 — Transport | TCP, UDP |
| 3 — Netzwerk | IP, ICMP |
| 2 — Sicherung | Ethernet, Wi-Fi (802.11) |
| 1 — Physisch | Kupferkabel, Glasfaser, Funk |
