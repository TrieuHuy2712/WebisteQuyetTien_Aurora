using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using WebsiteQuyetTien_byAurora_Team.Models;

namespace WebsiteQuyetTien_byAurora_Team.Controllers
{
    public class ProductController : Controller
    {
        public DmQT08Entities db = new DmQT08Entities();
        // GET: Product
        public ActionResult Index()
        {
            return View();
        }
        //Xem danh sách sản phẩm theo loại sản phẩm
        public ActionResult ViewListProductWithType(int? ProductTypeID)
        {
            //lấy ra danh sách các sản phẩm theo loại sản phẩm được yêu cầu
            var lstProductOfType = db.Products.Where(n => n.ProductTypeID == ProductTypeID);
            var productType = db.ProductTypes.SingleOrDefault(n => n.ID == ProductTypeID);
            //Kiểm tra có tồn tại loại sản phẩm đó không
            if (productType != null)
            {
                ViewBag.ProductType = productType;
                return View(lstProductOfType);
            }
            return RedirectToAction("Error", "Home");
        }
        //Cột thể loại sản phẩm
        public ActionResult CategoryPartial()
        {
            return PartialView();
        }
    }
}