using System;
using System.Collections.Concurrent;
using Newtonsoft.Json;

public class SMSServiceController
{
    // A thread-safe dictionary to store OTP data
    private static ConcurrentDictionary<string, SMSData> smsStore = new ConcurrentDictionary<string, SMSData>();

    private const int MaxAttempts = 3; // Maximum OTP attempts
    private static readonly TimeSpan SMSExpiryTime = TimeSpan.FromMinutes(2); // OTP expiration time

    // Class to store OTP data
    public class SMSData
    {
        public int AttemptCount { get; set; }
        public DateTime GeneratedTime { get; set; }
    }

    // Method to send SMS
    public string SendSMS(string mobileNumber)
    {
        if (smsStore.TryGetValue(mobileNumber, out SMSData existingData))
        {
            // Check if the OTP is expired
            if (DateTime.Now - existingData.GeneratedTime > SMSExpiryTime)
            {
                smsStore.TryRemove(mobileNumber, out _); // Remove expired OTP data
                string Status = "Status";
                string Description = "Description";
                return "{\"" + Status + "\" : \"" + "400" + "\", \"" + Description + "\" : \"" + "SMS lock time has expired. Please request a new SMS." + "\"}";

            }

            // Check if attempts exceed the limit
            if (existingData.AttemptCount >= MaxAttempts)
            {
                string Status = "Status";
                string Description = "Description";
                return "{\"" + Status + "\" : \"" + "400" + "\", \"" + Description + "\" : \"" + "SMS sending Failed due to multiple attempts." + "\"}";
            }

            // Increment attempt count
            existingData.AttemptCount++;
        }
        else
        {
            // Add new OTP data for the mobile number
            smsStore[mobileNumber] = new SMSData
            {
                AttemptCount = 1,
                GeneratedTime = DateTime.Now
            };
        }

        string status = "Status";
        string description = "Description";
        return "{\"" + status + "\" : \"" + "200" + "\", \"" + description + "\" : \"" + "SMS sent successfully." + "\"}";

    }


}
