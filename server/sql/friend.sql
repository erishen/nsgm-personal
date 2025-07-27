use crm_demo;

CREATE TABLE `friend` (
  `id` integer NOT NULL AUTO_INCREMENT COMMENT '主键',
  `name` varchar(100) DEFAULT '' COMMENT '名称',
  `phone` varchar(20) DEFAULT '' COMMENT '电话',
  `wechat` varchar(50) DEFAULT '' COMMENT '微信',
  `city` varchar(50) DEFAULT '' COMMENT '城市',
  `occupation` varchar(50) DEFAULT '' COMMENT '职业',
  `create_date` TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间',
  `update_date` TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3) COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;