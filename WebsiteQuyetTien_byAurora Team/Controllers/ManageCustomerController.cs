using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using WebsiteQuyetTien_byAurora_Team.Models;
using System.Net;
using System.Data.Entity;

namespace WebsiteQuyetTien_byAurora_Team.Controllers
{
    public class ManageCustomerController : Controller
    {
        private DmQT08Entities db = new DmQT08Entities();

        // GET: ManageCustomer
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
        public ActionResult getCustomer()
        {
            db.Configuration.ProxyCreationEnabled = false;
            var customer = db.Customers.Select(p => new
            {
                p.ID,
                p.CustomerCode,
                p.CustomerName,
                p.YearOfBirth,
                p.PhoneNumber,
                p.Address
            }).OrderByDescending(x => x.ID).ToList();
            return Json(customer, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult getCustomerID(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;
            var customer = db.Customers.Where(x => x.ID == id).Select(p => new
            {
                p.ID,
                p.CustomerCode,
                p.CustomerName,
                p.YearOfBirth,
                p.PhoneNumber,
                p.Address
            }).FirstOrDefault();
            return Json(customer, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult SaveEntity(Customer customer)
        {
            db.Configuration.ProxyCreationEnabled = false;
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            else
            {
                if (customer.ID == 0)
                {
                    db.Customers.Add(customer);
                }
                else
                {
                    db.Entry(customer).State = EntityState.Modified;
                }
                db.SaveChanges();
                return Json(customer, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult DangXuat()
        {
            Session["TaiKhoan"] = null;
            return RedirectToAction("Index", "Login", new { area = "" });
        }
    }
}