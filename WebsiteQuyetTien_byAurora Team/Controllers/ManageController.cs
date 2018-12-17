using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using WebsiteQuyetTien_byAurora_Team.Models;

namespace WebsiteQuyetTien_byAurora_Team.Controllers
{
    public class ManageController : Controller
    {
        private DmQT08Entities db = new DmQT08Entities();
        public int currentID;
        // GET: Manage
        public ActionResult Index()
        {
            if (Session["TaiKhoan"] == null || Session["TaiKhoan"].ToString() == "")
            {
                return RedirectToAction("Index", "Home");
            }
            ViewBag.TenTaiKhoan = Session["TaiKhoan"];
            //var product = db.Products.OrderBy(x => x.ID).ToList();
            return View();
        }

        [HttpGet]
        public ActionResult getProduct()
        {
            db.Configuration.ProxyCreationEnabled = false;

            var students = db.Products.Join(
            db.ProductTypes,
            s => s.ProductTypeID,
            c => c.ID,
            (s, c) => new
            {
                s.ID,
                s.ProductCode,
                s.ProductName,
                s.OriginPrice,
                s.InstallmentPrice,
                s.Quantity,
                s.SalePrice,
                s.Status,
                s.ProductTypeID,
                c.ProductTypeName,
                
            }).Where(s=>s.Status==true).ToList();
            
            return Json(students, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult getProductType()
        {
            db.Configuration.ProxyCreationEnabled = false;
            var productType = db.ProductTypes.ToList();
            return Json(productType, JsonRequestBehavior.AllowGet);
        }

        private void CheckBangSanPham(Product pr)
        {
            if (pr.OriginPrice < 0)
                ModelState.AddModelError("GiaGoc", "Gia goc phai lon hon 0");
            if (pr.OriginPrice > pr.SalePrice)
                ModelState.AddModelError("GiaBan", "Gia ban phai lon hon gia goc");
            if (pr.OriginPrice > pr.InstallmentPrice)
                ModelState.AddModelError("GiaGop", "Gia gop phai lon hon gia goc");
            if (pr.Quantity < 0)
            {
                ModelState.AddModelError("SoLuongTon", "So luong ton phai lon hon 0");
            }
        }

        [HttpPost]
        public ActionResult SaveEntity(Product product)
        {
            db.Configuration.ProxyCreationEnabled = false;
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            else
            {
                CheckBangSanPham(product);

                if (product.ID == 0)
                {
                    db.Products.Add(product);
                }
                else
                {
                    db.Entry(product).State = EntityState.Modified;
                }
                db.SaveChanges();
                return Json(product, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public ActionResult GetById(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;
            var product = db.Products.Where(x => x.ID == id).FirstOrDefault();
            return Json(product, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult Delete(int ID)
        {
            db.Configuration.ProxyCreationEnabled = false;
            Product bangsanpham = db.Products.Find(ID);
            bangsanpham.Status = false;
            db.Entry(bangsanpham).State = EntityState.Modified;
            db.SaveChanges();
            return Json(bangsanpham, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public string UploadImage(HttpPostedFileBase file)
        {
            file.SaveAs(Server.MapPath("/www.root/Img/" + file.FileName + ".png"));
            return "/www.root/Img/" + file.FileName + ".png";
        }
        public ActionResult DangXuat()
        {
            Session["TaiKhoan"] = null;
            return RedirectToAction("Index","Login", new { area = "" });
        }
    }
}