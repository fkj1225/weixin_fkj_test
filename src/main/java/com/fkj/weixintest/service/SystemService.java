package com.fkj.weixintest.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.fkj.weixintest.bean.po.System;

public interface SystemService
{
	Page<System> findAll(System qry, Pageable pageable);
	
	List<System> findAll(System qry);
	
	System findOne(Integer id);
	
	System save(System entity);
	
	void del(Integer id);
}
