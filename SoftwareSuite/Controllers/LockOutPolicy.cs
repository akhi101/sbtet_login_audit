using System;
using System.Threading.Tasks;

public class LockOutPolicy
{
    private int loginAttempts = 0;
    private bool loginLocked = false;

    public async Task<bool> Login(string username, string password)
    {
        if (loginLocked)
        {
            Console.WriteLine("Account is locked. Try again later.");
            return false;
        }

        if (Authenticate(username, password))
        {
            Console.WriteLine("Login successful.");
            loginAttempts = 0; // Reset attempts on successful login
            return true;
        }
        else
        {
            loginAttempts++;
            Console.WriteLine($"Login failed. Attempts: {loginAttempts}");

            if (loginAttempts >= 2)
            {
                loginLocked = true;
                Console.WriteLine("Account locked for 1 minute.");
                await ResetLoginAttempts();
            }
            return false;
        }
    }

    private bool Authenticate(string username, string password)
    {
        // Replace with actual authentication logic
        return username == "admin" && password == "password";
    }

    private async Task ResetLoginAttempts()
    {
        await Task.Delay(1 * 60 * 1000); // 1-minute delay
        loginAttempts = 0;
        loginLocked = false;
        Console.WriteLine("Account unlocked. You can try logging in again.");
    }
}
