/**
 * 
 */
package com.fkj.weixintest.jpa;

import java.io.Serializable;

import javax.persistence.EntityManager;

import org.springframework.data.jpa.repository.support.JpaRepositoryFactoryBean;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.core.support.RepositoryFactorySupport;

/**
 * @author magicjhxie
 *
 */
public class JpaRepositoryWsdFactoryBean<T extends Repository<S, ID>, S, ID extends Serializable> extends
		JpaRepositoryFactoryBean<T, S, ID> {

		/**
		 * Returns a {@link RepositoryFactorySupport}.
		 * 
		 * @param entityManager
		 * @return
		 */
		protected RepositoryFactorySupport createRepositoryFactory(EntityManager entityManager) {
			return new JpaRepositoryWsdFactory(entityManager);
		}
	}

