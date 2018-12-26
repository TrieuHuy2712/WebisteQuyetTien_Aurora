using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web.Mvc;
using WebsiteQuyetTien_byAurora_Team.Models;

namespace WebsiteQuyetTien_byAurora_Team.Controllers
{
    public class ProductTypeController : Controller
    {
        private DmQT08Entities db = new DmQT08Entities();

        // GET: ProductType
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult getTypeProduct()
        {
            db.Configuration.ProxyCreationEnabled = false;
            var productType = db.ProductTypes.Select(p => new
            {
                p.ID,
                p.ProductTypeCode,
                p.ProductTypeName,
            }).OrderByDescending(x=>x.ID).ToList();
            return Json(productType, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult getTypeID(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;
            var productType = db.ProductTypes.Where(x => x.ID == id).Select(p => new
            {
                p.ProductTypeCode,
                p.ProductTypeName,
            }).FirstOrDefault();
            return Json(productType, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult SaveEntity(ProductType productType)
        {
            db.Configuration.ProxyCreationEnabled = false;
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            else
            {
                if (productType.ID == 0)
                {
                    db.ProductTypes.Add(productType);
                }
                else
                {
                    db.Entry(productType).State = EntityState.Modified;
                }
                db.SaveChanges();
                return Json(productType, JsonRequestBehavior.AllowGet);
            }
        }
    }
}