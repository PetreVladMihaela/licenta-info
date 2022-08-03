using System.Security.Cryptography;
using System.Text;

namespace backend
{
    public class Program
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("Console\n");

            //Console.WriteLine("Please enter the text that you want to encrypt:");
            //string? plainText = Console.ReadLine();

            //if (plainText != null)
            //{
            //    string cipherText = Aes256Encryption.EncryptData(plainText);
            //    Console.WriteLine("Here is the cipher text:");
            //    Console.WriteLine(cipherText);

            //    // Decrypt the bytes to a string.    
            //    string decryptedText = Aes256Encryption.DecryptData(cipherText); 
            //    Console.WriteLine($"Decrypted data: {decryptedText}");
            //}

            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}