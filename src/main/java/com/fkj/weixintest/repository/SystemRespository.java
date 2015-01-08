/**
 * 
 */
package com.fkj.weixintest.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.fkj.weixintest.bean.po.System;

/**
 * @author kejingfeng
 *
 */
public interface SystemRespository extends JpaRepository<System, Integer>,JpaSpecificationExecutor<System> {
	Page<System> findByName(String name, Pageable pageable);
}
