package com.fkj.weixintest.service;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.fkj.weixintest.bean.po.System;
import com.fkj.weixintest.repository.SystemRespository;
import com.fkj.weixintest.repository.spec.SystemSpecification;

@Service
public class SystemServiceImpl implements SystemService
{

	@Resource
    private SystemRespository systemRespository;
	
	@Override
	public Page<System> findAll(System qry, Pageable pageable)
	{
		SystemSpecification spec = new SystemSpecification(qry);
		return systemRespository.findAll(spec, pageable);
	}

	@Override
	public List<System> findAll(System qry)
	{
		SystemSpecification spec = new SystemSpecification(qry);
		return systemRespository.findAll(spec);
	}

	@Override
	public System findOne(Integer id)
	{
		return systemRespository.findOne(id);
	}

	@Override
	public System save(System entity)
	{
		return systemRespository.save(entity);
	}

	@Override
	public void del(Integer id)
	{
		systemRespository.delete(id);
		
	}
	

}
