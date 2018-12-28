using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using WebsiteQuyetTien_byAurora_Team.Controllers;
using WebsiteQuyetTien_byAurora_Team.Models;

namespace WebsiteQuyetTien_byAurora_Team.Tests.Controllers
{
    [TestClass]
    public class ManageCashBillControllerTest
    {
        [TestMethod]
        public void getCashBillTest()
        {
            var controller = new ManageCashBillController();
            var result = controller.getCashBill() as JsonResult;
            var db = new DmQT08Entities();
            Assert.IsNotNull(result);
            var list = result.Data as IEnumerable;
            var count = 0;
            foreach (var item in list)
                count++;
            Assert.AreEqual(db.CashBills.Count(), count);
        }

        [TestMethod]
        public void getAllProductTest()
        {
            var controller = new ManageCashBillController();
            var result = controller.getAllProduct() as JsonResult;
            var db = new DmQT08Entities();
            Assert.IsNotNull(result);
            var list = result.Data as IEnumerable;
            var count = 0;
            foreach (var item in list)
                count++;
            Assert.AreEqual(db.Products.Where(x => x.Status == true).Count(), count);
        }

        [TestMethod]
        public void getProductTest()
        {
            var db = new DmQT08Entities();
            var controller = new ManageCashBillController();
            var model1 = db.CashBillDetails.FirstOrDefault();
            var model = db.CashBillDetails.Where(x=>x.BillID==model1.BillID).ToList();

            var result = controller.getProduct(model1.BillID) as JsonResult;

            Assert.IsNotNull(result);
            IList<CashDetail> ca =new List<CashDetail>();
            foreach (var item in model)
            {
                var obj = new CashDetail
                {
                    ID = item.ID,
                    ProductID = item.ProductID,
                    ProductName= item.Product.ProductName,
                    Quantity = item.Quantity,
                    SalePrice = item.SalePrice,
                };
                ca.Add(obj);
            }

            Assert.AreEqual(JsonConvert.SerializeObject(ca), JsonConvert.SerializeObject(result.Data));
        }
    }
}