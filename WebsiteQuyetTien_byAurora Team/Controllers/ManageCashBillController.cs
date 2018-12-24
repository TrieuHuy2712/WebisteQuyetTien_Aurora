using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web.Mvc;
using WebsiteQuyetTien_byAurora_Team.Models;

namespace WebsiteQuyetTien_byAurora_Team.Controllers
{
    public class ManageCashBillController : Controller
    {
        private DmQT08Entities1 db = new DmQT08Entities1();

        // GET: ManageCashBill
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
        public JsonResult getCashBill()
        {
            db.Configuration.ProxyCreationEnabled = false;

            var cashBill = db.CashBills.ToList();

            return Json(cashBill, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult getAllProduct()
        {
            db.Configuration.ProxyCreationEnabled = false;

            var cashBill = db.Products.OrderBy(x => x.ID).ToList();
            return Json(cashBill, JsonRequestBehavior.AllowGet);
        }

        //Lấy những sản phẩm thuộc ID
        [HttpGet]
        public JsonResult getProduct(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;
            var result = from p in db.Products
                         join d in db.CashBillDetails on p.ID equals d.ProductID
                         where d.BillID == id
                         select new
                         {
                             d.ID,
                             d.ProductID,
                             p.ProductName,
                             d.Quantity,
                             p.SalePrice,
                         };
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult SaveEntity(CashBill cb)
        {
            db.Configuration.ProxyCreationEnabled = false;
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            else
            {
                var details = cb.CashBillDetails.ToList();

                if (cb.ID == 0)
                {
                    db.CashBills.Add(cb);
                }
                else
                {
                    db.Entry(cb).State = EntityState.Modified;
                    foreach (var item in details)
                    {
                        if (item.ID == 0)
                        {
                            db.CashBillDetails.Add(item);
                        }
                        else
                        {
                            db.Entry(item).State = EntityState.Modified;
                        }
                    }
                }
                db.SaveChanges();
                return Json(new
                {
                    cb.ID,
                    cb.BillCode,
                    cb.CustomerName,
                    cb.Date,
                    cb.GrandTotal,
                    cb.Note,
                    cb.PhoneNumber,
                }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult PrintBill(int id)
        {
            var order = db.CashBills.FirstOrDefault(n => n.ID == id);
            if (order != null)
            {
                ReceiptCashModel rp = new ReceiptCashModel();
                rp.BillCode = order.BillCode;
                rp.CustomerName = order.CustomerName;
                rp.Address = order.Address;
                rp.PhoneNumber = order.PhoneNumber;
                rp.Date = order.Date;
                rp.Shipper = order.Shipper;
                rp.Note = order.Note;
                rp.GrandTotal = int.Parse(order.GrandTotal.ToString());
                rp.CashBillDetail = order.CashBillDetails.ToList();
                return View(rp);
            }
            else
            {
                return View();
            }
        }
    }
}