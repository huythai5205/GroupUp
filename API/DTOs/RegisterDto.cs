using System;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class RegisterDto
    {
        [EmailAddress]
        public string Email { get; set; }
        public string ConfirmEmail { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        [MaxLength(256)]
        public string Password { get; set; }
        public string ConfirmPassword { get; set; }

        [Required(ErrorMessage = "Please enter your first name")]
        [Display(Name = "FirstName")]
        [MaxLength(256)]
        public string FirstName { get; set; }

        [Required(ErrorMessage = "Please enter your last name")]
        [Display(Name = "LastName")]
        [MaxLength(256)] public string LastName { get; set; }
        [Required(ErrorMessage = "Please pick your gender")]
        [Display(Name = "Gender")]
        [MaxLength(256)]
        public string Gender { get; set; }

        [Required(ErrorMessage = "Please enter your date of birth")]
        [Display(Name = "DOB")]
        public DateTime DOB { get; set; }
    }
}