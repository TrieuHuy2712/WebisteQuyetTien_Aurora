﻿using System.Collections.Generic;
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
        public DmQT08Entities db = new DmQT08Entities();
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
        public JsonResult getProduct()
        {
            db.Configuration.ProxyCreationEnabled = false;

            var products = db.Products.Select(p => new
            {
                p.ID,
                p.ProductCode,
                p.ProductName,
                p.OriginPrice,
                p.InstallmentPrice,
                p.Quantity,
                p.SalePrice,
                p.Status,
                p.ProductTypeID,
                p.ManufactoryID,
                p.ProductType.ProductTypeName,
                p.Manufactory.ManufactoryName
            }).Where(s => s.Status == true).OrderByDescending(x => x.ID).ToList();

            return Json(products, JsonRequestBehavior.AllowGet);
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

        [HttpPost, ValidateInput(false)]
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
            var model = db.Products.Where(x => x.ID == id).Select(p => new
            {
                p.ID,
                p.ProductCode,
                p.ProductName,
                p.SalePrice,
                p.Quantity,
                p.OriginPrice,
                p.Description,
                p.ManufactoryID,
                p.InstallmentPrice,
                p.ProductTypeID,
                p.Status,
                p.Avatar,
                p.ProductType.ProductTypeName,
                p.Manufactory.ManufactoryName
            }).FirstOrDefault();
            return Json(model, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult getManufacture()
        {
            db.Configuration.ProxyCreationEnabled = false;
            var manu = db.Manufactories.ToList();
            return Json(manu, JsonRequestBehavior.AllowGet);
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
            return RedirectToAction("Index", "Login", new { area = "" });
        }
    }
}