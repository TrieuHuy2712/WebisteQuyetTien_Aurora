using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WebsiteQuyetTien_byAurora_Team.Controllers
{
    public class HomeController : Controller
    {
        //Giao diện chính
        public ActionResult Index()
        {
            return View();
        }
        //Giao diện về chúng tôi
        public ActionResult About()
        {
            return View();
        }

        //Hướng dẫn mua trả góp
        public ActionResult InstallmentHelper()
        {
            return View();
        }
        //Giao diện liên lạc
        public ActionResult Contactus()
        {
            return View();
        }
        //Giao diện trang tin tức sự kiện
        public ActionResult News()
        {
            return View();
        }
    }
}