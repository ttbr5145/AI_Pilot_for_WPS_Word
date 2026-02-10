using System;
using System.IO;
using System.Xml;
using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;
using System.Security.Cryptography.Xml;

class Signer {
    static int Main(string[] args) {
        if (args.Length < 3) {
            Console.Error.WriteLine("Usage: signer.exe <manifest.xml> <pfx> <pfxPassword>");
            return 2;
        }
        string manifestPath = args[0];
        string pfxPath = args[1];
        string pfxPassword = args[2];
        if (!File.Exists(manifestPath)) { Console.Error.WriteLine("Manifest not found: " + manifestPath); return 3; }
        if (!File.Exists(pfxPath)) { Console.Error.WriteLine("PFX not found: " + pfxPath); return 4; }

        try {
            XmlDocument xmlDoc = new XmlDocument();
            xmlDoc.PreserveWhitespace = true;
            xmlDoc.Load(manifestPath);

            var cert = new X509Certificate2(pfxPath, pfxPassword, X509KeyStorageFlags.Exportable);
            RSA rsaKey = null;
            try { rsaKey = cert.GetRSAPrivateKey(); } catch { }
            if (rsaKey == null) {
                // fallback to PrivateKey (RSACryptoServiceProvider)
                var pk = cert.PrivateKey as RSACryptoServiceProvider;
                if (pk != null) rsaKey = pk;
            }
            if (rsaKey == null) { Console.Error.WriteLine("Failed to get RSA private key from PFX"); return 5; }

            SignedXml signedXml = new SignedXml(xmlDoc);
            signedXml.SigningKey = rsaKey;

            Reference reference = new Reference();
            reference.Uri = "";
            XmlDsigEnvelopedSignatureTransform env = new XmlDsigEnvelopedSignatureTransform();
            reference.AddTransform(env);
            XmlDsigC14NTransform c14n = new XmlDsigC14NTransform();
            reference.AddTransform(c14n);

            signedXml.AddReference(reference);

            KeyInfo keyInfo = new KeyInfo();
            KeyInfoX509Data x509Data = new KeyInfoX509Data(cert);
            keyInfo.AddClause(x509Data);
            signedXml.KeyInfo = keyInfo;

            signedXml.ComputeSignature();
            XmlElement xmlDigitalSignature = signedXml.GetXml();

            xmlDoc.DocumentElement.AppendChild(xmlDoc.ImportNode(xmlDigitalSignature, true));
            var bak = manifestPath + ".bak";
            if (File.Exists(bak)) File.Delete(bak);
            File.Move(manifestPath, bak);
            xmlDoc.Save(manifestPath);
            Console.WriteLine("Signed manifest saved to " + manifestPath + " (backup at " + bak + ")");
            return 0;
        } catch (Exception ex) {
            Console.Error.WriteLine("Error: " + ex.Message);
            return 1;
        }
    }
}
