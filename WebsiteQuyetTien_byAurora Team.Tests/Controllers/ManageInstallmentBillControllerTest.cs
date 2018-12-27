using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using WebsiteQuyetTien_byAurora_Team.Models;
using WebsiteQuyetTien_byAurora_Team.Controllers;
using System.Web.Mvc;
using System.Collections;
using System.Linq;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace WebsiteQuyetTien_byAurora_Team.Tests.Controllers
{
    [TestClass]
    public class ManageInstallmentBillControllerTest
    {
        [TestMethod]
        public void getInstallmentBillTest()
        {
            var controller = new ManageInstallmentBillController();
            var result = controller.getInstallmentBill() as JsonResult;
            var db = new DmQT08Entities();
            Assert.IsNotNull(result);
            var list = result.Data as IEnumerable;
            var count = 0;
            foreach (var item in list)
                count++;
            Assert.AreEqual(db.InstallmentBills.Count(), count);
        }

        [TestMethod]
        public void getAllCustomerTest()
        {
            var controller = new ManageInstallmentBillController();
            var result = controller.getAllCustomer() as JsonResult;
            var db = new DmQT08Entities();
            Assert.IsNotNull(result);
            var list = result.Data as IEnumerable;
            var count = 0;
            foreach (var item in list)
                count++;
            Assert.AreEqual(db.Customers.Count(), count);
        }
        [TestMethod]
        public void getAllProduct()
        {
            var controller = new ManageInstallmentBillController();
            var result = controller.getAllProduct() as JsonResult;
            var db = new DmQT08Entities();
            Assert.IsNotNull(result);
            var list = result.Data as IEnumerable;
            var count = 0;
            foreach (var item in list)
                count++;
            Assert.AreEqual(db.Products.Where(x=>x.Status==true).Count(), count);
        }
        [TestMethod]
        public void getProductTest()
        {
            var db = new DmQT08Entities();
            var controller = new ManageInstallmentBillController();
            var model1 = db.InstallmentBillDetails.FirstOrDefault();
            var model = db.InstallmentBillDetails.Where(x => x.BillID == model1.BillID).ToList();

            var result = controller.getProduct(model1.BillID) as JsonResult;

            Assert.IsNotNull(result);
            IList<InstallmentDetail> ca = new List<InstallmentDetail>();
            foreach (var item in model)
            {
                var obj = new InstallmentDetail
                {
                    ID = item.ID,
                    ProductID = item.ProductID,
                    ProductName = item.Product.ProductName,
                    Quantity = item.Quantity,
                    InstallmentPrice = item.Product.InstallmentPrice,
                };
                ca.Add(obj);
            }
            Assert.AreEqual(JsonConvert.SerializeObject(ca), JsonConvert.SerializeObject(result.Data));
        }
    }
}
