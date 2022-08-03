using System.Security.Cryptography;
using System.Text;

namespace backend
{
    public class Aes256Encryption
    {
        private static readonly Aes aesAlgorithm = Aes.Create();
        private static readonly string key = "hWmZq4t7w!z%C*F-JaNdRgUjXn2r5u8x";
        //private static readonly string key = "QfTjWnZr4u7x!A%C";
        private static readonly byte[] iv = new byte[16] { 12, 0xb7, 33, 40, 0xf0, 5, 76, 8, 0x35, 59, 0x51, 0xed, 2, 0x08, 0x48, 0x5d };
        //static byte[] iv = new byte[16]; //toate el. sunt init. cu 0

        //public Aes256Encryption(string aesKey, byte[] aesIV)
        //{
        //    aesAlgorithm.KeySize = 128;
        //    aesAlgorithm.Key = Encoding.UTF8.GetBytes(aesKey);
        //    aesAlgorithm.IV = aesIV;

        //    //Console.WriteLine($"{aesAlgorithm.IV}"); -> System.Byte[]
        //    //Console.WriteLine($"iv = {Encoding.UTF8.GetString(aesAlgorithm.IV)}");

        //    Console.WriteLine($"Aes Cipher Mode : {aesAlgorithm.Mode}");
        //    Console.WriteLine($"Aes Padding Mode: {aesAlgorithm.Padding}");
        //    Console.WriteLine($"Aes Key Size : {aesAlgorithm.KeySize}");
        //    Console.WriteLine($"Aes Block Size : {aesAlgorithm.BlockSize}");
        //}

        public static string EncryptData(string plainText)
        {
            // Create encryptor object 
            ICryptoTransform encryptor = aesAlgorithm.CreateEncryptor(Encoding.UTF8.GetBytes(key), iv);

            byte[] encryptedData;

            //Encryption will be done in a memory stream through a CryptoStream object
            using (MemoryStream ms = new())
            {
                using CryptoStream cs = new(ms, encryptor, CryptoStreamMode.Write);
                using (StreamWriter sw = new(cs))
                {
                    sw.Write(plainText);
                }
                encryptedData = ms.ToArray();
            }

            return Convert.ToBase64String(encryptedData);
        }

        public static string DecryptData(string cipherText)
        {
            // Create decryptor object
            ICryptoTransform decryptor = aesAlgorithm.CreateDecryptor(Encoding.UTF8.GetBytes(key), iv);

            byte[] encryptedData = Convert.FromBase64String(cipherText);

            //Decryption will be done in a memory stream through a CryptoStream object
            using MemoryStream ms = new(encryptedData);
            using CryptoStream cs = new(ms, decryptor, CryptoStreamMode.Read);
            using StreamReader sr = new(cs);
            return sr.ReadToEnd();
        }
    }
}

//256
//plaintext = test
//ciphertext = 3VQKMo1LcJrZkBcKdoB8OQ==
