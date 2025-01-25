using System;
using System.Security.Cryptography;
using System.Text;

public class DynamicEncryptionHelper
{
    public static (string EncryptedImage, string Key, string IV) EncryptBase64(string base64Image)
    {
        using (Aes aes = Aes.Create())
        {
            aes.KeySize = 256;
            aes.BlockSize = 128;
            aes.Mode = CipherMode.CBC;
            aes.Padding = PaddingMode.PKCS7;

            // Generate dynamic key and IV
            aes.GenerateKey();
            aes.GenerateIV();

            byte[] keyBytes = aes.Key;
            byte[] ivBytes = aes.IV;
            byte[] imageBytes = Convert.FromBase64String(base64Image);

            using (var encryptor = aes.CreateEncryptor())
            {
                byte[] encryptedBytes = encryptor.TransformFinalBlock(imageBytes, 0, imageBytes.Length);

                // Return encrypted image, key, and IV as Base64
                return (
                    EncryptedImage: Convert.ToBase64String(encryptedBytes),
                    Key: Convert.ToBase64String(keyBytes),
                    IV: Convert.ToBase64String(ivBytes)
                );
            }
        }
    }
}
