/**
 *Create By @Author:Sean Lei
 *@Date:2014年10月10日
 *@Email:sean.yu.lei@gmail.com
 */
package com.fkj.weixintest.config;

import java.beans.PropertyVetoException;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import com.mchange.v2.c3p0.ComboPooledDataSource;

@Configuration
public class DataSourceConfig {
    @Autowired
    private Environment env;

    @Bean(name = "autogenspringDataSource")
    public DataSource flowDataSource() throws PropertyVetoException {
        ComboPooledDataSource dataSource = new ComboPooledDataSource();
        setDataSourceCommonProperty(dataSource);
        dataSource.setJdbcUrl(env.getProperty("autogenspring.jdbc.url"));
        dataSource.setUser(env.getProperty("autogenspring.jdbc.username"));
        dataSource.setPassword(env.getProperty("autogenspring.jdbc.password"));

        return dataSource;
    }

    private void setDataSourceCommonProperty(ComboPooledDataSource dataSource)
            throws PropertyVetoException {
        dataSource.setDriverClass(env.getProperty("jdbc.driverClassName"));
        dataSource.setInitialPoolSize(env.getProperty("db.initialPoolSize",
                Integer.class));
        dataSource.setMaxIdleTime(env.getProperty("db.maxIdleTime",
                Integer.class));
        dataSource.setMaxPoolSize(env.getProperty("db.maxPoolSize",
                Integer.class));
        dataSource.setMinPoolSize(env.getProperty("db.minPoolSize",
                Integer.class));
        dataSource.setIdleConnectionTestPeriod(env.getProperty(
                "db.idleConnectionTestPeriod", Integer.class));
        dataSource.setAcquireRetryAttempts(env.getProperty(
                "db.acquireRetryAttempts", Integer.class));
        dataSource.setAcquireIncrement(env.getProperty("db.acquireIncrement",
                Integer.class));
    }

}
