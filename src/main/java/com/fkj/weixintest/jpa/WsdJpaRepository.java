package com.fkj.weixintest.jpa;

import java.io.Serializable;
import java.util.Collections;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.query.QueryUtils;
import org.springframework.data.jpa.repository.support.JpaEntityInformation;
import org.springframework.data.jpa.repository.support.SimpleJpaRepository;

public class WsdJpaRepository<T, ID extends Serializable> extends SimpleJpaRepository<T, ID>{
	
	public WsdJpaRepository(JpaEntityInformation<T, ?> entityInformation, EntityManager entityManager) {
		super(entityInformation, entityManager);
	}

	/**
	 * Creates a new {@link SimpleJpaRepository} to manage objects of the given domain type.
	 * 
	 * @param domainClass must not be {@literal null}.
	 * @param em must not be {@literal null}.
	 */
	public WsdJpaRepository(Class<T> domainClass, EntityManager em) {
		super(domainClass, em);
	}
	
	public Page<T> findAll(Specification<T> spec, Pageable pageable) {

		TypedQuery<T> query = getQuery(spec, pageable);
		return pageable == null ? new WsdPageImpl<T>(query.getResultList()) : readPage(query, pageable, spec);
	}
	
	protected Page<T> readPage(TypedQuery<T> query, Pageable pageable, Specification<T> spec) {

		query.setFirstResult(pageable.getOffset());
		query.setMaxResults(pageable.getPageSize());

		Long total = QueryUtils.executeCountQuery(getCountQuery(spec));
		List<T> content = total > pageable.getOffset() ? query.getResultList() : Collections.<T> emptyList();

		return new WsdPageImpl<T>(content, pageable, total);
	}
	
	public Page<T> findAll(Pageable pageable) {

		if (null == pageable) {
			return new WsdPageImpl<T>(findAll());
		}

		return findAll(null, pageable);
	}

	
}
