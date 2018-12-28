using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;
using System.Linq;
using System.Web.Mvc;
using WebsiteQuyetTien_byAurora_Team.Controllers;
using WebsiteQuyetTien_byAurora_Team.Models;
using Moq;
using System.Collections;
using System.Web;
using System.Web.Routing;
using System.Transactions;

namespace WebsiteQuyetTien_byAurora_Team.Tests.Controllers
{
    [TestClass]
    public class ManageControllerTest
    {
        [TestMethod]
        public void TestProductList()
        {
            var controller = new ManageController();
            var result = controller.getProduct() as JsonResult;
            var db = new DmQT08Entities();
            Assert.IsNotNull(result);
            var list = result.Data as IEnumerable;
            var count = 0;
            foreach (var item in list)
                count++;
            Assert.AreEqual(db.Products.Where(x=>x.Status==true).Count(), count);
        }

        [TestMethod]
        public void TestCategory()
        {
            var db = new DmQT08Entities();
            var controller = new ManageController();
            var result = controller.getProductType() as JsonResult;
           
                        Assert.IsNotNull(result);
            var list = result.Data as IEnumerable;
            var count = 0;
            foreach (var item in list)
            {
                count++;
            }
            Assert.AreEqual(db.ProductTypes.Count(), count);
        }
        [TestMethod]
        public void TestManufacturer()
        {

            var db = new DmQT08Entities();
            var controller = new ManageController();
            var result = controller.getManufacture() as JsonResult;

            Assert.IsNotNull(result);
            var list = result.Data as IEnumerable;
            var count = 0;
            foreach (var item in list)
            {
                count++;
            }
            Assert.AreEqual(db.Manufactories.Count(), count);
        }

        [TestMethod]
        public void ChiTietSanPham()
        {
            var db = new DmQT08Entities();
            var controller = new ManageController();
            var model = db.Products.First();
            var result = controller.GetById(model.ID) as JsonResult;
            Assert.IsNotNull(result);
            Assert.AreEqual(JsonConvert.SerializeObject(new
            {
                ID = model.ID,
                ProductCode = model.ProductCode,
                ProductName = model.ProductName,
                SalePrice = model.SalePrice,
                Quantity = model.Quantity,
                OriginPrice = model.OriginPrice,
                Description = model.Description,
                ManufactoryID = model.ManufactoryID,
                InstallmentPrice = model.InstallmentPrice,
                ProductTypeID = model.ProductTypeID,
                
                Status = model.Status,
                Avatar= model.Avatar,
                ProductTypeName = model.ProductType.ProductTypeName,
                ManufactoryName = model.Manufactory.ManufactoryName,
                
               

            }), JsonConvert.SerializeObject(result.Data));
        }
        [TestMethod]
        public void TestSaveEntity1()
        {
            var db = new DmQT08Entities();
            var model = new Product();
            model.ProductTypeID= db.ProductTypes.First().ID;
            model.ProductName = "TenSP";
            model.ProductCode = "MaSP";
            model.OriginPrice = 123;
            model.SalePrice = 456;
            model.InstallmentPrice = 789;
            model.Quantity = 10;
            int count = db.Products.Count();
            var controller = new ManageController();
            using (var scope = new TransactionScope())
            {
                model.ID = 0;
                var result0 = controller.SaveEntity(model) as JsonResult;
                Assert.IsNotNull(result0);
                Assert.AreEqual(count + 1, db.Products.Count());

                Assert.IsInstanceOfType(result0.Data, typeof(Product));
                var product = result0.Data as Product;
                Assert.AreEqual("TenSP", product.ProductName);
            }
        }
        [TestMethod]
        public void TestSaveEntity2()
        {
            var db = new DmQT08Entities();
            var model = db.Products.AsNoTracking().First();
            
            int count = db.Products.Count();
            var controller = new ManageController();
            using (var scope = new TransactionScope())
            {
                model.ID = 1;
                model.ProductTypeID = 2;
                var result0 = controller.SaveEntity(model) as JsonResult;
                Assert.IsNotNull(result0);
                Assert.AreEqual(count , db.Products.Count());

                Assert.IsInstanceOfType(result0.Data, typeof(Product));
                var product = result0.Data as Product;
                Assert.AreEqual(2, product.ProductTypeID);
            }
        }
    }
}