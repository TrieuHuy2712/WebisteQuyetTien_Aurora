using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebsiteQuyetTien_byAurora_Team.Models;

namespace WebsiteQuyetTien_byAurora_Team.Controllers
{
    public class HomeController : Controller
    {
        DmQT08Entities db = new DmQT08Entities();
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
        //Giao diện tin tức sự kiện chi tiết
        public ActionResult NewsDetail()
        {
            return View();
        }
        //Giao diện không tìm thấy trang
        public ActionResult Error()
        {
            return View();
        }


        //Menu droplist danh sách sản phẩm hiển thị theo loại sản phẩm và nhà cung cấp
        public ActionResult MenuPartial()
        {
            var listPro = db.Products.Where(n=>n.Status==true);
            return PartialView(listPro);
        }
    }
}