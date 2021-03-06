﻿using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web.Mvc;
using WebsiteQuyetTien_byAurora_Team.Models;

namespace WebsiteQuyetTien_byAurora_Team.Controllers
{
    public class ManageInstallmentBillController : Controller
    {
        private DmQT08Entities db = new DmQT08Entities();

        // GET: ManageInstallmentBill
        public ActionResult Index()
        {
            if (Session["TaiKhoan"] == null || Session["TaiKhoan"].ToString() == "")
            {
                return RedirectToAction("Index", "Home");
            }
            ViewBag.TenTaiKhoan = Session["TaiKhoan"];
            return View();
        }

        [HttpGet]
        public ActionResult getInstallmentBill()
        {
            db.Configuration.ProxyCreationEnabled = false;

            var installment = db.InstallmentBills.Join(
            db.Customers,
            s => s.CustomerID,
            c => c.ID,
            (s, c) => new
            {
                s.BillCode,
                s.CustomerID,
                s.Date,
                s.GrandTotal,
                s.Shipper,
                s.Taken,
                s.Remain,
                s.Method,
                s.Note,
                s.Period,
                s.ID,
                c.CustomerName,
                
            }).OrderByDescending(x => x.BillCode).ToList();

            return Json(installment, JsonRequestBehavior.AllowGet);
        }
        [HttpGet]
        public ActionResult getAllCustomer()
        {
            db.Configuration.ProxyCreationEnabled = false;
            var customer = db.Customers.ToList();
            return Json(customer, JsonRequestBehavior.AllowGet);
        }
        [HttpGet]
        public JsonResult getAllProduct()
        {
            db.Configuration.ProxyCreationEnabled = false;

            var cashBill = db.Products.OrderBy(x => x.ID).Where(x=>x.Status==true).ToList();
            return Json(cashBill, JsonRequestBehavior.AllowGet);
        }
        [HttpGet]
        public JsonResult getProduct(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;
            var result = from p in db.Products
                         join d in db.InstallmentBillDetails on p.ID equals d.ProductID
                         where d.BillID == id
                         select new
                         {
                             d.ID,
                             d.ProductID,
                             p.ProductName,
                             d.Quantity,
                             p.InstallmentPrice,
                         };
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public ActionResult SaveEntity(InstallmentBill ib)
        {
            db.Configuration.ProxyCreationEnabled = false;
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            else
            {
                var details = ib.InstallmentBillDetails.ToList();

                if (ib.ID == 0)
                {
                    db.InstallmentBills.Add(ib);
                }
                else
                {
                    db.Entry(ib).State = EntityState.Modified;
                    foreach (var item in details)
                    {
                        if (item.ID == 0)
                        {
                            db.InstallmentBillDetails.Add(item);
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
                    ID = ib.ID,
                    BillCode= ib.BillCode,
                    CustomerID= ib.CustomerID,
                    Date= ib.Date,
                    GrandTotal= ib.GrandTotal,
                    Method= ib.Method,
                    Period= ib.Period,
                    Remain= ib.Remain,
                    Taken= ib.Taken,
                }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult PrintBill(int id)
        {
            var order = db.InstallmentBills.FirstOrDefault(o => o.ID == id);
            if (order != null)
            {
                ReceiptInstallment rp = new ReceiptInstallment();
                rp.BillCode = order.BillCode;
                rp.CustomerID = order.CustomerID;
                rp.Date = order.Date;
                rp.GrandTotal = order.GrandTotal;
                rp.Method = order.Method;
                rp.Note = order.Note;
                rp.Period = order.Period;
                rp.Remain = order.Remain;
                rp.Shipper = order.Shipper;
                rp.Taken = order.Taken;
                rp.Customer = order.Customer;
                rp.InstallmentBillDetail = order.InstallmentBillDetails.ToList();
                return View(rp);
            }
            else
            {
                return View();
            }
        }
        public ActionResult DangXuat()
        {
            Session["TaiKhoan"] = null;
            return RedirectToAction("Index", "Login", new { area = "" });
        }
    }
}