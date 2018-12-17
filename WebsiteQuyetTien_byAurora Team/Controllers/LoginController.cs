using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebsiteQuyetTien_byAurora_Team.Models;

namespace WebsiteQuyetTien_byAurora_Team.Controllers
{
    public class LoginController : Controller
    {
        DmQT08Entities db = new DmQT08Entities();
        // GET: Login
        public ActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public ActionResult checkLogin(string username, string password)
        {
            Account acc = db.Accounts.SingleOrDefault(n => n.Username == username && n.Password == password);
            if (acc != null)
            {
                Session["TaiKhoan"] = acc;
                var taikhoan = db.Accounts.SingleOrDefault(n => n.Username == username && n.Password == password);
                return Content("<script>window.location.reload();</script>");
            }
            return Content("Tài khoản hoặc mật khẩu không đúng");
        }
        
    }
}