package com.fkj.weixintest.jpa;

import static org.springframework.data.querydsl.QueryDslUtils.QUERY_DSL_PRESENT;

import java.io.Serializable;

import javax.persistence.EntityManager;

import org.springframework.data.jpa.repository.support.JpaEntityInformation;
import org.springframework.data.jpa.repository.support.JpaRepositoryFactory;
import org.springframework.data.jpa.repository.support.QueryDslJpaRepository;
import org.springframework.data.jpa.repository.support.SimpleJpaRepository;
import org.springframework.data.querydsl.QueryDslPredicateExecutor;
import org.springframework.data.repository.core.RepositoryMetadata;

public class JpaRepositoryWsdFactory extends JpaRepositoryFactory{

	public JpaRepositoryWsdFactory(EntityManager entityManager) {
		super(entityManager);
		// TODO Auto-generated constructor stub
	}
	
	private boolean isQueryDslExecutor(Class<?> repositoryInterface) {

		return QUERY_DSL_PRESENT && QueryDslPredicateExecutor.class.isAssignableFrom(repositoryInterface);
	}
	
	@Override
	@SuppressWarnings({ "unchecked", "rawtypes" })
	protected <T, ID extends Serializable> SimpleJpaRepository<?, ?> getTargetRepository(
			RepositoryMetadata metadata, EntityManager entityManager) {
		
		Class<?> repositoryInterface = metadata.getRepositoryInterface();
		JpaEntityInformation<?, Serializable> entityInformation = getEntityInformation(metadata.getDomainType());

		SimpleJpaRepository<?, ?> repo = this.isQueryDslExecutor(repositoryInterface) ? new QueryDslJpaRepository(
				entityInformation, entityManager) : new WsdJpaRepository(entityInformation, entityManager);

		return repo;
	}

}
