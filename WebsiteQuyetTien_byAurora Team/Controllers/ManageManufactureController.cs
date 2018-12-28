using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using WebsiteQuyetTien_byAurora_Team.Models;
using System.Net;
using System.Data.Entity;

namespace WebsiteQuyetTien_byAurora_Team.Controllers
{
    public class ManageManufactureController : Controller
    {
        DmQT08Entities db = new DmQT08Entities();
        // GET: ManageManufacture
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

        public ActionResult getTypeProduct()
        {
            db.Configuration.ProxyCreationEnabled = false;
            var manu = db.Manufactories.Select(p => new
            {
                p.ID,
                p.ManufactoryCode,
                p.ManufactoryName
            }).OrderByDescending(x=>x.ID).ToList();
            return Json(manu, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult getTypeID(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;
            var manu = db.Manufactories.Where(x => x.ID == id).Select(p => new
            {
                p.ManufactoryName,
                p.ManufactoryCode
            }).FirstOrDefault();
            return Json(manu, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult SaveEntity(Manufactory manufactory)
        {
            db.Configuration.ProxyCreationEnabled = false;
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            else
            {
                if (manufactory.ID == 0)
                {
                    db.Manufactories.Add(manufactory);
                }
                else
                {
                    db.Entry(manufactory).State = EntityState.Modified;
                }
                db.SaveChanges();
                return Json(manufactory, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult DangXuat()
        {
            Session["TaiKhoan"] = null;
            return RedirectToAction("Index", "Login", new { area = "" });
        }

    }
}