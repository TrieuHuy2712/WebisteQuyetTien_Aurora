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

        //Xem danh sách sản phẩm theo loại sản phẩm
        public ActionResult ViewListProductWithType(int? ProductTypeID)
        {
            //lấy ra danh sách các sản phẩm theo loại sản phẩm được yêu cầu
            var lstProductOfType = db.Products.Where(n => n.ProductTypeID == ProductTypeID && n.Status == true);
            var productType = db.ProductTypes.SingleOrDefault(n => n.ID == ProductTypeID);
            //Kiểm tra có tồn tại loại sản phẩm đó không
            if (productType != null)
            {
                ViewBag.ProductType = productType;
                return View(lstProductOfType);
            }
            return RedirectToAction("Error", "Home");
        }

        //Xem danh sách sản phẩm đươc xếp theo nhà sản xuất
        public ActionResult ViewListProductWithManufactor(int? ProductTypeID, int? ManufactoryID)
        {
            //lấy ra danh sách các sản phẩm theo loại sản phẩm được yêu cầu và theo đúng nhà sản xuất
            var lstProductOfType = db.Products.Where(n => n.ProductTypeID == ProductTypeID && n.Status == true && n.ManufactoryID == ManufactoryID);
            var productType = db.ProductTypes.SingleOrDefault(n => n.ID == ProductTypeID);
            var productManu = db.Manufactories.SingleOrDefault(n => n.ID == ManufactoryID);
            
            //Kiểm tra có tồn tại nhà sản xuất đó không
            if (productType != null && productManu != null)
            {
                ViewBag.ProductType = productType;
                ViewBag.productManu = productManu;
                return View(lstProductOfType);
            }
            return RedirectToAction("Error", "Home");
        }

        //Trang xem chi tiết sản phẩm
        public ActionResult ViewDetail(int? ID)
        {
            var pro = db.Products.SingleOrDefault(n => n.ID == ID && n.Status == true);
            if(pro != null)
            {
                return View(pro);
            }
            return RedirectToAction("Error", "Home");
        }

        //Cột thể loại sản phẩm Partial
        public ActionResult CategoryPartial()
        {
            var lstProduct = db.Products.Where(n=>n.Status==true);
            return PartialView(lstProduct);
        }
    }
}