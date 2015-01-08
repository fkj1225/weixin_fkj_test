package com.fkj.weixintest.test;

import java.util.List;

import javax.annotation.Resource;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.fkj.weixintest.config.AppConfig;
import com.fkj.weixintest.service.SystemService;
import com.fkj.weixintest.bean.po.System;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = AppConfig.class)
public class SystemServiceTest
{
	@Resource
    private SystemService systemService;
	
	@Test
	public void findSystemAllTest(){
		System qry = new System();
		qry.setId(1);
		qry.setName("111");
		List<System> list = systemService.findAll(qry);
		java.lang.System.out.println(list.size());
		
	}
}
