using System;
using System.Security.Cryptography;
using System.Text;

public class SecurityHelper
{
    private const string HMAC_SECRET_KEY = "YourSuperSecretKey"; // Store securely in config or environment

    public static string ComputeHMAC(string message)
    {
        using (var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(HMAC_SECRET_KEY)))
        {
            byte[] hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(message));
            return Convert.ToBase64String(hash);
        }
    }

    public static bool ValidateHMAC(string message, string providedHmac)
    {
        string expectedHmac = ComputeHMAC(message);
        return expectedHmac == providedHmac;
    }
}

