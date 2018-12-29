using System;
using System.Collections;
using System.Linq;
using System.Transactions;
using System.Web.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;
using WebsiteQuyetTien_byAurora_Team.Controllers;
using WebsiteQuyetTien_byAurora_Team.Models;
namespace WebsiteQuyetTien_byAurora_Team.Tests.Controllers
{
    [TestClass]
    public class ProductTypeControllerTest
    {
        [TestMethod]
        public void TestGetTypeProduct()
        {
            var controller = new ProductTypeController();
            var result = controller.getTypeProduct() as JsonResult;
            var db = new DmQT08Entities();
            Assert.IsNotNull(result);
            var list = result.Data as IEnumerable;
            var count = 0;
            foreach (var item in list)
                count++;
            Assert.AreEqual(db.ProductTypes.Count(), count);
        }
        [TestMethod]
        public void TestGetTypeID()
        {
            var db = new DmQT08Entities();
            var controller = new ProductTypeController();
            var model = db.ProductTypes.First();
            var result = controller.getTypeID(model.ID) as JsonResult;
            Assert.IsNotNull(result);
            Assert.AreEqual(JsonConvert.SerializeObject(new
            {
                model.ProductTypeCode,
                model.ProductTypeName,
            }), JsonConvert.SerializeObject(result.Data));
        }
        [TestMethod]
        public void TestSaveEntity1()
        {
            var db = new DmQT08Entities();
            var model = new ProductType();

            model.ProductTypeCode = "CHE";
            model.ProductTypeName = "CHelsea";

            int count = db.ProductTypes.Count();
            var controller = new ProductTypeController();
            using (var scope = new TransactionScope())
            {
                model.ID = 0;
                var result0 = controller.SaveEntity(model) as JsonResult;
                Assert.IsNotNull(result0);
                Assert.AreEqual(count + 1, db.ProductTypes.Count());

                Assert.IsInstanceOfType(result0.Data, typeof(ProductType));
                var productType = result0.Data as ProductType;
                Assert.AreEqual("CHelsea", productType.ProductTypeName);
            }
        }
        [TestMethod]
        public void TestSaveEntity2()
        {
            var db = new DmQT08Entities();
            var model = db.ProductTypes.AsNoTracking().First();

            int count = db.ProductTypes.Count();
            var controller = new ProductTypeController();
            using (var scope = new TransactionScope())
            {
                model.ID = 1;
                model.ProductTypeName = "Hazard";
                var result0 = controller.SaveEntity(model) as JsonResult;
                Assert.IsNotNull(result0);
                Assert.AreEqual(count, db.ProductTypes.Count());

                Assert.IsInstanceOfType(result0.Data, typeof(ProductType));
                var productType = result0.Data as ProductType;
                Assert.AreEqual("Hazard", productType.ProductTypeName);
            }
        }
    }
}
