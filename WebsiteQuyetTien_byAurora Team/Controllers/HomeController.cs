using System.Linq;
using System.Web.Mvc;
using WebsiteQuyetTien_byAurora_Team.Models;

namespace WebsiteQuyetTien_byAurora_Team.Controllers
{
    public class HomeController : Controller
    {
        private DmQT08Entities db = new DmQT08Entities();

        //Giao diện chính
        public ActionResult Index()
        {
            //Lây ra danh sách 8 sản phẩm bán chạy nhất
            var lstProBestSale = db.CashBillDetails.OrderByDescending(n => n.Quantity).GroupBy(n => n.ProductID);
            ViewBag.lstProBestSale = lstProBestSale;
            //Lấy danh sách 8 sản phẩm mới nhất
            var lstProNew = db.Products.Where(n => n.Status == true).OrderByDescending(n => n.ID);
            return View(lstProNew);
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
            var listPro = db.Products.Where(n => n.Status == true);
            return PartialView(listPro);
        }

        //Tìm kiếm sản phẩm theo tên
        public ActionResult Search(FormCollection f)
        {
            var pro = f["searchKey"];
            var lstpro = db.Products.Where(n => n.ProductName.Contains(pro) && n.Status==true);
            if(lstpro != null)
            {
                if(lstpro.Count() == 1)
                {
                    var product = db.Products.SingleOrDefault(n => n.ProductName.Contains(pro) && n.Status == true);
                    if (product != null)
                    {
                        return RedirectToAction("ViewDetail", "Product", new { @ID = product.ID });
                    }
                    return RedirectToAction("Error", "Home");
                }
                if(lstpro.Count() == 0)
                {
                    return RedirectToAction("Error", "Home");
                }
                ViewBag.searchKey = pro;
                return View(lstpro);
            }
            return RedirectToAction("Error", "Home");
        }

        public JsonResult getProductName()
        {
            db.Configuration.ProxyCreationEnabled = false;
            var products = db.Products.Where(x=>x.Status==true).Select(p => new
            {
                p.ProductName,
            }).ToList();
            return Json(products, JsonRequestBehavior.AllowGet);
        }
    }
}