using System;
using System.Security.Cryptography;
using System.Text;

public class PasswordHasher
{

        // Method to generate a secure salt
        public static byte[] GenerateSalt(int size = 16)
        {
            var salt = new byte[size];
            using (var rng = new RNGCryptoServiceProvider())
            {
                rng.GetBytes(salt);
            }
            return salt;
        }


    // Method to hash data with salt using SHA256
    public static byte[] HashWithSalt(string data, byte[] salt)
    {
        using (var sha256 = SHA256.Create())
        {
            // Combine data and salt
            var dataBytes = Encoding.UTF8.GetBytes(data);
            var dataWithSalt = new byte[dataBytes.Length + salt.Length];
            Buffer.BlockCopy(dataBytes, 0, dataWithSalt, 0, dataBytes.Length);
            Buffer.BlockCopy(salt, 0, dataWithSalt, dataBytes.Length, salt.Length);

            // Compute hash
            return sha256.ComputeHash(dataWithSalt);
        }
    }

    // Method to validate the password
    public static bool ValidatePassword(string enteredPassword, byte[] storedSalt, byte[] storedHash)
    {
        // Hash the entered password with the stored salt
        byte[] enteredHash = HashWithSalt(enteredPassword, storedSalt);

        // Compare the computed hash with the stored hash
        return CompareByteArrays(enteredHash, storedHash);
    }

    // Helper method to compare byte arrays
    private static bool CompareByteArrays(byte[] a, byte[] b)
    {
        if (a.Length != b.Length) return false;

        for (int i = 0; i < a.Length; i++)
        {
            if (a[i] != b[i]) return false;
        }
        return true;
    }

}
