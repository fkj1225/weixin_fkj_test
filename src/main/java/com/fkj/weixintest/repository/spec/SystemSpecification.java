/**
 * 
 */
package com.fkj.weixintest.repository.spec;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.apache.commons.lang.StringUtils;
import org.springframework.data.jpa.domain.Specification;

import com.fkj.weixintest.bean.po.System;

/**
 * @author kejingfeng
 *
 */
public class SystemSpecification implements Specification<System> {
    
    private final System criteria;

    public SystemSpecification(System criteria) {
        this.criteria=criteria;
    }

    @Override
    public Predicate toPredicate( Root<System> root, CriteriaQuery<?> query, CriteriaBuilder cb ) {
        List<Predicate> list = new ArrayList<Predicate>();
        if(criteria.getId()!=null && criteria.getId()>0)
        {
        	list.add(cb.equal(root.get("id").as(Integer.class), criteria.getId()));
        }  
        if(StringUtils.isNotBlank(criteria.getName())){
        	list.add(cb.like(root.get("name").as(String.class), "%"+criteria.getName()+"%"));
        }
        if(StringUtils.isNotBlank(criteria.getComment())){
        	list.add(cb.like(root.get("comment").as(String.class), "%"+criteria.getComment()+"%"));
        }
        Predicate[] p = new Predicate[list.size()];  
        return cb.and(list.toArray(p));  
    }

}
