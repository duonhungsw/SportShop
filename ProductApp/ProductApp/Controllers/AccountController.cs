using BusinessObject.Entities;
using BusinessObject.Entities.OrderAddregate;
using BusinessObject.Interfaces;
using DataAccess.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProductApp.DTOs;
using ProductApp.Extensions;

namespace ProductApp.Controllers
{
    public class AccountController(SignInManager<User?> signInManager, IUnitOfWork unit) : BaseApiController
    {
        [HttpPost("register")]
        public async Task<ActionResult<RegisterDTOs>> Register(RegisterDTOs registerDTOs)
        {
            var user = new User
            {
                FirstName = registerDTOs.FirstName,
                LastName = registerDTOs.LastName,
                Email = registerDTOs.Email,
                UserName = registerDTOs.Email
            };

            var result = await signInManager.UserManager.CreateAsync(user, registerDTOs.Password);
            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(error.Code, error.Description);

                }
                return ValidationProblem();
            }
            return Ok();
        }


        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await signInManager.SignOutAsync();
            return NoContent();
        }
        [Authorize]
        [HttpGet("user-info")]
        public async Task<ActionResult> GetUserInfo()
        {
            if (User.Identity?.IsAuthenticated == false) return NoContent();

            var user = await signInManager.UserManager.GetUserByEmailWithAddress(User);

            return Ok(new
            {
                user.FirstName,
                user.LastName,
                user.Email,
                Address = user.Address?.ToDtos(),
            });
        }

        [HttpGet("auth-status")]
        public ActionResult GetAuthState()
        {
            return Ok(new { IsAuthenticated = User.Identity?.IsAuthenticated ?? false });
        }

        [Authorize]
        [HttpPost("address")]
        public async Task<ActionResult> CreateOrUpdateAddress(AddressDTOs addressDTOs)
        {
            var user = await signInManager.UserManager.GetUserByEmailWithAddress(User);
            if(user.Address == null)
            {
                user.Address = addressDTOs.ToEntity();
            }
            else
            {
                user.Address.UpdateFromDto(addressDTOs);
            }
            var result = await signInManager.UserManager.UpdateAsync(user);
            if (!   result.Succeeded) return BadRequest("Problem updating user address");
            return Ok(user.Address.ToDtos());

        }

        //[HttpGet("get-all")]
        //public async Task<ActionResult> GetsUser()
        //{

        //    //var user = await unit.Repository<OrderItem>().ListAsync();
        //    //return Ok(user);
        //}
    }
}
